import React, { useState } from 'react';
import { OceanScore, Language, UserProfile, Trait } from './types';
import { QUICK_QUESTIONS, FULL_QUESTIONS, TRAIT_DETAILS } from './constants';
import { getLabel } from './translations';
import Assessment from './components/Assessment';
import AdviceGenerator from './components/AdviceGenerator';
import ProfileList from './components/ProfileList';
import PartnershipGenerator from './components/PartnershipGenerator';

type View = 'HOME' | 'ASSESSMENT' | 'RESULTS' | 'ADVICE' | 'PROFILES' | 'PARTNERSHIP';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [scores, setScores] = useState<OceanScore | undefined>(undefined);
  const [language, setLanguage] = useState<Language>('en');
  const [assessmentType, setAssessmentType] = useState<'quick' | 'full'>('quick');
  
  // State for the currently loaded profile
  const [activeProfile, setActiveProfile] = useState<UserProfile | undefined>(undefined);

  const handleAssessmentComplete = (results: OceanScore) => {
    setScores(results);
    // If we have an active profile, updating scores usually implies creating a new snapshot 
    // or just using these scores temporarily. For simplicity, if we are in a profile,
    // let's update the profile's scores locally but require a save in AdviceGenerator to persist.
    // Actually, AdviceGenerator takes activeProfile. If we just did an assessment, we might be creating a NEW profile.
    // If activeProfile exists, we might want to update it.
    
    // Strategy: If activeProfile exists, update its local scores state so AdviceGenerator sees new scores.
    if (activeProfile) {
        setActiveProfile({ ...activeProfile, scores: results });
    }
    setCurrentView('ADVICE');
  };

  const startAssessment = (type: 'quick' | 'full') => {
    setAssessmentType(type);
    setCurrentView('ASSESSMENT');
  };

  const handleProfileSelect = (profile: UserProfile) => {
      setActiveProfile(profile);
      setScores(profile.scores);
      setCurrentView('ADVICE');
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
      setActiveProfile(updatedProfile);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'HOME':
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-block bg-indigo-100 p-4 rounded-full mb-6">
                <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-4">
                {getLabel(language, 'homeTitle')}
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                {getLabel(language, 'homeDesc')}
              </p>
            </div>

            {/* Split Sections */}
            <div className="grid md:grid-cols-2 gap-8 w-full">
              
              {/* Left: Assessment */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-200 transition-colors flex flex-col items-start">
                  <div className="bg-indigo-50 p-3 rounded-lg mb-4">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">{getLabel(language, 'assessmentSection')}</h2>
                  <p className="text-slate-500 mb-8 flex-1">{getLabel(language, 'assessmentSectionDesc')}</p>
                  
                  <div className="w-full space-y-3">
                    <button
                        onClick={() => startAssessment('quick')}
                        className="w-full px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all text-left flex justify-between items-center group"
                    >
                        {getLabel(language, 'startQuick')}
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                    <button
                        onClick={() => startAssessment('full')}
                        className="w-full px-6 py-4 bg-white text-indigo-600 border-2 border-indigo-100 rounded-xl font-bold text-lg hover:border-indigo-200 hover:bg-indigo-50 transition-all text-left flex justify-between items-center group"
                    >
                        {getLabel(language, 'startThorough')}
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
              </div>

              {/* Right: Analysis */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-pink-200 transition-colors flex flex-col items-start">
                  <div className="bg-pink-50 p-3 rounded-lg mb-4">
                     <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                     </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">{getLabel(language, 'analysisSection')}</h2>
                  <p className="text-slate-500 mb-8 flex-1">{getLabel(language, 'analysisSectionDesc')}</p>
                  
                  <div className="w-full space-y-3">
                     <button
                        onClick={() => { setActiveProfile(undefined); setScores(undefined); setCurrentView('ADVICE'); }}
                        className="w-full px-6 py-4 bg-white text-indigo-600 border-2 border-indigo-100 rounded-xl font-bold text-lg hover:border-indigo-200 hover:bg-indigo-50 transition-all text-left flex justify-between items-center group"
                    >
                        {getLabel(language, 'individualAnalysis')}
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                     <button
                        onClick={() => setCurrentView('PARTNERSHIP')}
                        className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold text-lg shadow-md shadow-pink-100 hover:from-pink-600 hover:to-rose-600 hover:shadow-lg transition-all text-left flex justify-between items-center group"
                    >
                        {getLabel(language, 'startPartnership')}
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
              </div>

            </div>
          </div>
        );
      case 'ASSESSMENT':
        return (
          <Assessment
            questions={assessmentType === 'quick' ? QUICK_QUESTIONS : FULL_QUESTIONS}
            language={language}
            onComplete={handleAssessmentComplete}
            onCancel={() => setCurrentView('HOME')}
          />
        );
      case 'ADVICE':
        return (
          <AdviceGenerator 
            initialScores={scores} 
            activeProfile={activeProfile}
            language={language} 
            onProfileUpdate={handleProfileUpdate}
            onLoadProfile={() => setCurrentView('PROFILES')}
          />
        );
      case 'PROFILES':
          return (
              <ProfileList 
                language={language}
                onSelectProfile={handleProfileSelect}
                onCancel={() => setCurrentView('HOME')}
              />
          );
      case 'PARTNERSHIP':
          return (
              <PartnershipGenerator language={language} />
          );
      default:
        return <div>Not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center cursor-pointer" onClick={() => setCurrentView('HOME')}>
                <svg className="w-8 h-8 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <span className="font-bold text-xl text-slate-900 tracking-tight">{getLabel(language, 'title')}</span>
              </div>
              
              {/* OCEAN Traits Badges */}
              <div className="hidden lg:flex items-center ml-8 space-x-1.5">
                {[Trait.Openness, Trait.Conscientiousness, Trait.Extraversion, Trait.Agreeableness, Trait.Neuroticism].map((trait) => (
                  <div key={trait} className="group relative flex flex-col items-center">
                    <span 
                        className="w-6 h-6 flex items-center justify-center rounded-md text-[10px] font-bold text-white shadow-sm transition-transform hover:scale-110 cursor-default"
                        style={{ backgroundColor: TRAIT_DETAILS[trait].color }}
                    >
                      {TRAIT_DETAILS[trait].label[language].charAt(0)}
                    </span>
                    <span className="absolute top-full mt-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                        {TRAIT_DETAILS[trait].label[language]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
               {/* Language Switcher */}
              <div className="flex items-center space-x-2 border-r border-slate-200 pr-4 mr-2">
                 <button 
                   onClick={() => setLanguage('en')}
                   className={`px-2 py-1 rounded text-sm font-bold ${language === 'en' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
                 >
                   EN
                 </button>
                 <button 
                   onClick={() => setLanguage('de')}
                   className={`px-2 py-1 rounded text-sm font-bold ${language === 'de' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
                 >
                   DE
                 </button>
              </div>

              <button 
                onClick={() => setCurrentView('HOME')}
                className={`hidden sm:block text-sm font-medium ${currentView === 'HOME' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {getLabel(language, 'backHome')}
              </button>
              {activeProfile && (
                <div className="hidden md:flex items-center px-3 py-1 bg-indigo-50 rounded-full">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-xs font-bold text-indigo-700 max-w-[100px] truncate">{activeProfile.name}</span>
                    <button 
                        onClick={() => { setActiveProfile(undefined); setScores(undefined); setCurrentView('HOME'); }}
                        className="ml-2 text-indigo-400 hover:text-indigo-600"
                        title="Logout Profile"
                    >
                        ×
                    </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8">
        {renderContent()}
      </main>

       {/* Footer */}
       <footer className="bg-white border-t border-slate-200 mt-auto py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-400 text-sm">
              {getLabel(language, 'createdBy')}. {getLabel(language, 'footer')}
            </p>
          </div>
       </footer>
    </div>
  );
};

export default App;