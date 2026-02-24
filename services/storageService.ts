import { UserProfile } from '../types';

const STORAGE_KEY = 'oceanic_minds_profiles';

export const getProfiles = (): UserProfile[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading profiles", error);
    return [];
  }
};

export const saveProfile = (profile: UserProfile): void => {
  const profiles = getProfiles();
  const existingIndex = profiles.findIndex(p => p.id === profile.id);
  
  if (existingIndex >= 0) {
    profiles[existingIndex] = profile;
  } else {
    profiles.push(profile);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
};

export const deleteProfile = (id: string): void => {
  const profiles = getProfiles();
  const newProfiles = profiles.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfiles));
};

export const createProfile = (name: string, scores: any): UserProfile => {
  return {
    id: crypto.randomUUID(),
    name,
    created: new Date().toISOString(),
    scores,
    savedAdvices: []
  };
};
