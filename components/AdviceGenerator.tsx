import React, { useState, useEffect } from 'react';
import { OceanScore, Trait, AdviceCategory, Language, UserProfile, SavedAdvice } from '../types';
import { getOceanAdvice, getDeepDiveAnalysis } from '../services/geminiService';
import { saveProfile, createProfile } from '../services/storageService';
import { TRAIT_DETAILS } from '../constants';
import { getLabel, LABELS } from '../translations';
import OceanChart from './OceanChart';
import ReactMarkdown from 'react-markdown';

interface AdviceGeneratorProps {
  initialScores?: OceanScore;
  activeProfile?: UserProfile;
  language: Language;
  onProfileUpdate: (profile: UserProfile) => void;
  onLoadProfile: () => void;
}

const DEFAULT_SCORES: OceanScore = {
  [Trait.Openness]: 50,
  [Trait.Conscientiousness]: 50,
  [Trait.Extraversion]: 50,
  [Trait.Agreeableness]: 50,
  [Trait.Neuroticism]: 50,
};

const AdviceGenerator: React.FC<AdviceGeneratorProps> = ({ 
  initialScores, 
  activeProfile, 
  language, 
  onProfileUpdate,
  onLoadProfile
}) => {
  const [scores, setScores] = useState<OceanScore>(initialScores || activeProfile?.scores || DEFAULT_SCORES);
  const [selectedCategory, setSelectedCategory] = useState<AdviceCategory>(AdviceCategory.Career);
  const [freeText, setFreeText] = useState("");
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!activeProfile && !initialScores);
  const [profileName, setProfileName] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  
  // Deep Dive State
  const [chatHistory, setChatHistory] = useState<{question: string, answer: string}[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [asking, setAsking] = useState(false);

  // Update local scores when active profile changes
  useEffect(() => {
    if (activeProfile) {
      setScores(activeProfile.scores);
    }
  }, [activeProfile]);

  const handleScoreChange = (trait: Trait, value: number) => {
    setScores((prev) => ({ ...prev, [trait]: value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setAdvice(null);
    setChatHistory([]); // Reset history on new generation
    try {
      const result = await getOceanAdvice({ 
        scores, 
        category: selectedCategory, 
        freeText,
        language 
      });
      setAdvice(result);
    } catch (err) {
      setAdvice(getLabel(language, 'error'));
    } finally {
      setLoading(false);
    }
  };

  const handleAskFollowUp = async () => {
      if (!currentQuestion.trim() || !advice) return;
      
      setAsking(true);
      try {
          const answer = await getDeepDiveAnalysis(currentQuestion, advice, language);
          setChatHistory(prev => [...prev, { question: currentQuestion, answer }]);
          setCurrentQuestion("");
      } catch (error) {
          console.error(error);
      } finally {
          setAsking(false);
      }
  };

  const handleSaveProfile = () => {
    if (!profileName.trim()) return;
    const newProfile = createProfile(profileName, scores);
    
    // If advice exists, save it too
    if (advice) {
        const savedAdvice: SavedAdvice = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            category: selectedCategory,
            context: freeText,
            content: advice
        };
        newProfile.savedAdvices.push(savedAdvice);
    }
    
    saveProfile(newProfile);
    onProfileUpdate(newProfile);
    setIsSavingProfile(false);
  };

  const handleSaveAdvice = () => {
    if (!activeProfile || !advice) return;
    
    const savedAdvice: SavedAdvice = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        category: selectedCategory,
        context: freeText,
        content: advice
    };

    const updatedProfile = {
        ...activeProfile,
        savedAdvices: [savedAdvice, ...activeProfile.savedAdvices]
    };
    
    saveProfile(updatedProfile);
    onProfileUpdate(updatedProfile);
  };

  const loadSavedAdvice = (item: SavedAdvice) => {
      setAdvice(item.content);
      setSelectedCategory(item.category);
      setFreeText(item.context || "");
      setChatHistory([]); // Reset history when loading new saved advice
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto p-6">
      
      {/* Left Column: Controls & Chart */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-xl font-bold text-slate-800">
                    {activeProfile ? `${activeProfile.name}` : getLabel(language, 'yourProfile')}
                </h2>
                {!activeProfile && (
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                        {getLabel(language, 'unsavedProfile')}
                    </span>
                )}
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="text-sm text-indigo-600 hover:underline font-medium"
            >
              {isEditing ? getLabel(language, 'viewChart') : getLabel(language, 'editScores')}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-5">
              {Object.values(Trait).map((trait) => (
                <div key={trait}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-slate-700">{TRAIT_DETAILS[trait].label[language]}</span>
                    <span className="text-slate-500">{scores[trait]}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={scores[trait]}
                    onChange={(e) => handleScoreChange(trait, parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <p className="text-xs text-slate-400 mt-1">{TRAIT_DETAILS[trait].description[language]}</p>
                </div>
              ))}
            </div>
          ) : (
            <OceanChart scores={scores} language={language} />
          )}

            {/* Profile Actions */}
            <div className="mt-6 pt-6 border-t border-slate-100">
                {!activeProfile ? (
                    isSavingProfile ? (
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                value={profileName}
                                onChange={(e) => setProfileName(e.target.value)}
                                placeholder={getLabel(language, 'profileName')}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            />
                            <button 
                                onClick={handleSaveProfile}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                            >
                                Save
                            </button>
                            <button 
                                onClick={() => setIsSavingProfile(false)}
                                className="px-4 py-2 text-slate-500 text-sm hover:text-slate-700"
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                             <button 
                                onClick={() => setIsSavingProfile(true)}
                                className="w-full py-2 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                            >
                                + {getLabel(language, 'createProfile')}
                            </button>
                            <button
                                onClick={onLoadProfile}
                                className="w-full py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 hover:border-slate-300 transition-all text-sm"
                            >
                                {getLabel(language, 'loadProfile')}
                            </button>
                        </div>
                    )
                ) : (
                   <div className="text-sm text-center text-slate-500 bg-slate-50 py-2 rounded-lg">
                       {getLabel(language, 'currentProfile')}
                   </div>
                )}
            </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">{getLabel(language, 'getGuidance')}</h3>
          <p className="text-sm text-slate-600 mb-4">
            {getLabel(language, 'guidanceDesc')}
          </p>
          
          <label className="block text-sm font-medium text-slate-700 mb-2">{getLabel(language, 'topic')}</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as AdviceCategory)}
            className="w-full p-3 rounded-lg border border-indigo-200 bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-4"
          >
            {Object.values(AdviceCategory).map((cat) => (
              <option key={cat} value={cat}>{
                 LABELS[language].category[cat] || cat
              }</option>
            ))}
          </select>

          <label className="block text-sm font-medium text-slate-700 mb-2">{getLabel(language, 'contextLabel')}</label>
          <textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder={getLabel(language, 'contextPlaceholder')}
            className="w-full p-3 h-24 rounded-lg border border-indigo-200 bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-4 resize-none"
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`
              w-full py-3 rounded-lg font-bold text-white shadow-md transition-all
              ${loading 
                ? 'bg-slate-400 cursor-wait' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-0.5'}
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {getLabel(language, 'analyzing')}
              </span>
            ) : (
              getLabel(language, 'generate')
            )}
          </button>
        </div>

        {/* Saved Advices List */}
        {activeProfile && activeProfile.savedAdvices.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">{getLabel(language, 'savedInsights')}</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {activeProfile.savedAdvices.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => loadSavedAdvice(item)}
                            className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                    {LABELS[language].category[item.category]}
                                </span>
                                <span className="text-xs text-slate-400">
                                    {new Date(item.date).toLocaleDateString()}
                                </span>
                            </div>
                            {item.context && (
                                <p className="text-xs text-slate-500 line-clamp-2 mt-2 italic">
                                    "{item.context}"
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* Right Column: Output */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[500px] flex flex-col">
        {!advice && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center space-y-4">
            <svg className="w-16 h-16 opacity-20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p>{getLabel(language, 'placeholderAdvice')}</p>
          </div>
        )}
        
        {loading && (
           <div className="flex-1 flex flex-col items-center justify-center space-y-4 animate-pulse">
             <div className="h-4 bg-slate-200 rounded w-3/4"></div>
             <div className="h-4 bg-slate-200 rounded w-full"></div>
             <div className="h-4 bg-slate-200 rounded w-5/6"></div>
             <div className="h-32 bg-slate-200 rounded w-full mt-4"></div>
           </div>
        )}

        {advice && !loading && (
          <>
            <div className="flex justify-end mb-4">
                {activeProfile ? (
                     <button
                     onClick={handleSaveAdvice}
                     className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                   >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                     </svg>
                     {getLabel(language, 'saveAdvice')}
                   </button>
                ) : (
                    <span className="text-xs text-slate-400 italic">
                        {getLabel(language, 'createProfile')} to save
                    </span>
                )}
            </div>
            
            <div className="prose prose-slate prose-indigo max-w-none">
              <ReactMarkdown components={{
                h2: ({node, ...props}) => <h2 className="text-xl font-bold text-indigo-700 mt-8 mb-4 border-b border-indigo-100 pb-2" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 mb-4 text-slate-700" {...props} />,
                li: ({node, ...props}) => <li className="pl-1" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 text-slate-700 leading-relaxed" {...props} />
              }}>
                  {advice}
              </ReactMarkdown>
            </div>

            {/* Deep Dive & Discussion Section */}
            <div className="mt-10 pt-8 border-t-2 border-slate-100">
               <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                 </svg>
                 {getLabel(language, 'deepDiveTitle')}
               </h3>
               
               {/* Chat History */}
               {chatHistory.length > 0 && (
                   <div className="space-y-6 mb-8">
                       {chatHistory.map((msg, idx) => (
                           <div key={idx} className="flex flex-col gap-3">
                               <div className="flex justify-end">
                                   <div className="bg-indigo-100 text-indigo-900 rounded-2xl rounded-tr-none py-3 px-4 max-w-[85%] text-sm">
                                       <p className="font-semibold text-xs text-indigo-500 mb-1">You</p>
                                       {msg.question}
                                   </div>
                               </div>
                               <div className="flex justify-start">
                                   <div className="bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl rounded-tl-none py-4 px-5 max-w-[90%] text-sm shadow-sm">
                                      <p className="font-semibold text-xs text-slate-400 mb-2">AI Assistant</p>
                                      <div className="prose prose-sm prose-slate">
                                        <ReactMarkdown>{msg.answer}</ReactMarkdown>
                                      </div>
                                   </div>
                               </div>
                           </div>
                       ))}
                   </div>
               )}

               {/* Input Area */}
               <div className="relative">
                   <textarea
                     value={currentQuestion}
                     onChange={(e) => setCurrentQuestion(e.target.value)}
                     placeholder={getLabel(language, 'askQuestionPlaceholder')}
                     className="w-full p-4 pr-32 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:bg-white transition-all resize-none shadow-inner"
                     rows={3}
                   />
                   <div className="absolute bottom-3 right-3">
                       <button
                         onClick={handleAskFollowUp}
                         disabled={asking || !currentQuestion.trim()}
                         className={`
                           px-4 py-2 rounded-lg text-sm font-bold text-white shadow-md transition-all
                           ${asking || !currentQuestion.trim()
                             ? 'bg-slate-300 cursor-not-allowed' 
                             : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5'}
                         `}
                       >
                         {asking ? (
                            <span className="flex items-center gap-1">
                                <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                ...
                            </span>
                         ) : getLabel(language, 'askBtn')}
                       </button>
                   </div>
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdviceGenerator;