import React, { useState, useEffect } from 'react';
import { OceanScore, Language, UserProfile, Trait } from '../types';
import { getProfiles } from '../services/storageService';
import { getPartnershipAdvice } from '../services/geminiService';
import { getLabel } from '../translations';
import { TRAIT_DETAILS } from '../constants';
import OceanChart from './OceanChart';
import ReactMarkdown from 'react-markdown';

interface PartnershipGeneratorProps {
  language: Language;
}

const DEFAULT_SCORES: OceanScore = {
  [Trait.Openness]: 50,
  [Trait.Conscientiousness]: 50,
  [Trait.Extraversion]: 50,
  [Trait.Agreeableness]: 50,
  [Trait.Neuroticism]: 50,
};

const PartnershipGenerator: React.FC<PartnershipGeneratorProps> = ({ language }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  
  // Partner A State
  const [profileIdA, setProfileIdA] = useState<string>('manual');
  const [manualScoresA, setManualScoresA] = useState<OceanScore>(DEFAULT_SCORES);
  const [nameA, setNameA] = useState("Partner A");

  // Partner B State
  const [profileIdB, setProfileIdB] = useState<string>('manual');
  const [manualScoresB, setManualScoresB] = useState<OceanScore>(DEFAULT_SCORES);
  const [nameB, setNameB] = useState("Partner B");

  // Analysis State
  const [freeText, setFreeText] = useState("");
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProfiles(getProfiles());
  }, []);

  // Helper to get actual scores based on selection
  const getScoresA = () => {
    if (profileIdA === 'manual') return manualScoresA;
    const p = profiles.find(p => p.id === profileIdA);
    return p ? p.scores : manualScoresA;
  };

  const getScoresB = () => {
    if (profileIdB === 'manual') return manualScoresB;
    const p = profiles.find(p => p.id === profileIdB);
    return p ? p.scores : manualScoresB;
  };

  // Helper to update manual scores
  const updateManualScore = (
    isPartnerA: boolean,
    trait: Trait,
    value: number
  ) => {
    if (isPartnerA) {
      setManualScoresA(prev => ({ ...prev, [trait]: value }));
    } else {
      setManualScoresB(prev => ({ ...prev, [trait]: value }));
    }
  };

  const handleProfileChange = (isPartnerA: boolean, id: string) => {
      const selectedProfile = profiles.find(p => p.id === id);
      if (isPartnerA) {
          setProfileIdA(id);
          if (selectedProfile) setNameA(selectedProfile.name);
          else setNameA("Partner A");
      } else {
          setProfileIdB(id);
          if (selectedProfile) setNameB(selectedProfile.name);
          else setNameB("Partner B");
      }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setAdvice(null);
    const scoresA = getScoresA();
    const scoresB = getScoresB();
    
    try {
        const result = await getPartnershipAdvice(scoresA, scoresB, nameA, nameB, language, freeText);
        setAdvice(result);
    } catch (e) {
        setAdvice(getLabel(language, 'error'));
    } finally {
        setLoading(false);
    }
  };

  const renderProfileSelector = (isPartnerA: boolean) => {
    const profileId = isPartnerA ? profileIdA : profileIdB;
    const manualScores = isPartnerA ? manualScoresA : manualScoresB;
    const label = isPartnerA ? getLabel(language, 'partnerA') : getLabel(language, 'partnerB');
    const name = isPartnerA ? nameA : nameB;
    const setName = isPartnerA ? setNameA : setNameB;

    return (
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">{label}</h3>
        
        <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{getLabel(language, 'selectProfile')}</label>
            <select
                value={profileId}
                onChange={(e) => handleProfileChange(isPartnerA, e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
            >
                <option value="manual">{getLabel(language, 'manualInput')}</option>
                {profiles.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                ))}
            </select>
        </div>

        {profileId === 'manual' && (
             <div className="mb-4">
                 <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Name</label>
                 <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-sm"
                 />
             </div>
        )}

        <div className={`space-y-3 ${profileId !== 'manual' ? 'opacity-50 pointer-events-none' : ''}`}>
             {Object.values(Trait).map((trait) => (
                <div key={trait}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">{TRAIT_DETAILS[trait].label[language]}</span>
                    <span>{profileId !== 'manual' ? (isPartnerA ? getScoresA()[trait] : getScoresB()[trait]) : manualScores[trait]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={profileId !== 'manual' ? (isPartnerA ? getScoresA()[trait] : getScoresB()[trait]) : manualScores[trait]}
                    onChange={(e) => updateManualScore(isPartnerA, trait, parseInt(e.target.value))}
                    disabled={profileId !== 'manual'}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900">{getLabel(language, 'partnershipTitle')}</h2>
            <p className="text-slate-500 mt-2 max-w-2xl mx-auto">{getLabel(language, 'partnershipDesc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Left: Partner A */}
            {renderProfileSelector(true)}

            {/* Middle: Actions & Chart */}
            <div className="space-y-6">
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                     <h3 className="text-center text-sm font-bold text-slate-700 mb-2">{getLabel(language, 'compatibilityReport')}</h3>
                     <OceanChart 
                        scores={getScoresA()} 
                        secondaryScores={getScoresB()} 
                        language={language}
                        labelA={nameA}
                        labelB={nameB}
                     />
                 </div>

                 {/* Context Input */}
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                        {getLabel(language, 'partnershipContextLabel')}
                    </label>
                    <textarea 
                        value={freeText}
                        onChange={(e) => setFreeText(e.target.value)}
                        placeholder={getLabel(language, 'partnershipContextPlaceholder')}
                        className="w-full p-2 text-sm border border-slate-300 rounded-lg h-24 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                 </div>
                 
                 <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className={`
                      w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all
                      ${loading 
                        ? 'bg-slate-400 cursor-wait' 
                        : 'bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 hover:-translate-y-1'}
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
                    ) : getLabel(language, 'compare')}
                 </button>
            </div>

            {/* Right: Partner B */}
            {renderProfileSelector(false)}
        </div>

        {/* Results Section */}
        {advice && (
             <div className="mt-12 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-4xl mx-auto">
                 <div className="flex items-center justify-center mb-8">
                     <div className="h-px bg-slate-200 flex-1"></div>
                     <span className="px-4 text-slate-400 font-medium uppercase text-sm tracking-widest">{getLabel(language, 'compatibilityReport')}</span>
                     <div className="h-px bg-slate-200 flex-1"></div>
                 </div>
                 
                 <div className="prose prose-slate prose-indigo max-w-none">
                    <ReactMarkdown components={{
                        h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-6 flex items-center gap-3" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 mb-4 text-slate-700" {...props} />,
                        p: ({node, ...props}) => <p className="mb-4 text-slate-700 leading-relaxed text-lg" {...props} />
                    }}>
                        {advice}
                    </ReactMarkdown>
                 </div>
             </div>
        )}
    </div>
  );
};

export default PartnershipGenerator;