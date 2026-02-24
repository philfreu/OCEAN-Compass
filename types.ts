export type Language = 'en' | 'de';

export enum Trait {
  Openness = 'Openness',
  Conscientiousness = 'Conscientiousness',
  Extraversion = 'Extraversion',
  Agreeableness = 'Agreeableness',
  Neuroticism = 'Neuroticism',
}

export interface Question {
  id: number;
  text: {
    en: string;
    de: string;
  };
  trait: Trait;
  keyed: 'plus' | 'minus';
}

export interface OceanScore {
  [Trait.Openness]: number;
  [Trait.Conscientiousness]: number;
  [Trait.Extraversion]: number;
  [Trait.Agreeableness]: number;
  [Trait.Neuroticism]: number;
}

export enum AdviceCategory {
  Career = 'Career & Professional Development',
  Relationships = 'Relationships & Social Life',
  PersonalGrowth = 'Personal Growth & Habits',
  StressManagement = 'Stress Management & Health',
  Leadership = 'Leadership & Teamwork'
}

export interface AnalysisRequest {
  scores: OceanScore;
  category: AdviceCategory;
  freeText?: string;
  language: Language;
}

export interface TraitDefinition {
  label: {
    en: string;
    de: string;
  };
  description: {
    en: string;
    de: string;
  };
  color: string;
}

export interface SavedAdvice {
  id: string;
  date: string; // ISO String
  category: AdviceCategory;
  context?: string;
  content: string;
}

export interface UserProfile {
  id: string;
  name: string;
  created: string; // ISO String
  scores: OceanScore;
  savedAdvices: SavedAdvice[];
}
