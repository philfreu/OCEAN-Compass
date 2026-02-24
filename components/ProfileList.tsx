import React, { useEffect, useState } from 'react';
import { UserProfile, Language } from '../types';
import { getProfiles, deleteProfile } from '../services/storageService';
import { getLabel } from '../translations';
import OceanChart from './OceanChart';

interface ProfileListProps {
  language: Language;
  onSelectProfile: (profile: UserProfile) => void;
  onCancel: () => void;
}

const ProfileList: React.FC<ProfileListProps> = ({ language, onSelectProfile, onCancel }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);

  useEffect(() => {
    setProfiles(getProfiles());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure?")) {
      deleteProfile(id);
      setProfiles(getProfiles());
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">{getLabel(language, 'manageProfiles')}</h2>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-lg mb-4">{getLabel(language, 'noProfiles')}</p>
          <button 
            onClick={onCancel}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {getLabel(language, 'backHome')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profiles.map((profile) => (
            <div 
              key={profile.id}
              onClick={() => onSelectProfile(profile)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {profile.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {new Date(profile.created).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDelete(profile.id, e)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors z-10"
                  title={getLabel(language, 'deleteProfile')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="h-40 pointer-events-none">
                 <OceanChart scores={profile.scores} language={language} />
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">
                  {profile.savedAdvices.length} {getLabel(language, 'savedInsights')}
                </span>
                <span className="text-indigo-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {getLabel(language, 'loadProfile')} →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileList;
