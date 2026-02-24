import { Question, Trait, TraitDefinition } from './types';

// Expanded IPIP pool (Proxy for IPIP-50)
export const ALL_QUESTIONS: Question[] = [
  // --- Extraversion ---
  { id: 1, text: { en: "Am the life of the party.", de: "Bin der Mittelpunkt der Party." }, trait: Trait.Extraversion, keyed: 'plus' },
  { id: 2, text: { en: "Don't talk a lot.", de: "Rede nicht viel." }, trait: Trait.Extraversion, keyed: 'minus' },
  { id: 3, text: { en: "Talk to a lot of different people at parties.", de: "Unterhalte mich auf Partys mit vielen verschiedenen Leuten." }, trait: Trait.Extraversion, keyed: 'plus' },
  { id: 4, text: { en: "Keep in the background.", de: "Halte mich im Hintergrund." }, trait: Trait.Extraversion, keyed: 'minus' },
  { id: 21, text: { en: "Start conversations.", de: "Beginne Gespräche." }, trait: Trait.Extraversion, keyed: 'plus' },
  { id: 22, text: { en: "Have little to say.", de: "Habe wenig zu sagen." }, trait: Trait.Extraversion, keyed: 'minus' },
  { id: 23, text: { en: "Feel comfortable around people.", de: "Fühle mich wohl unter Menschen." }, trait: Trait.Extraversion, keyed: 'plus' },
  { id: 24, text: { en: "Find it difficult to approach others.", de: "Finde es schwierig, auf andere zuzugehen." }, trait: Trait.Extraversion, keyed: 'minus' },
  { id: 41, text: { en: "Don't mind being the center of attention.", de: "Macht es nichts aus, im Mittelpunkt zu stehen." }, trait: Trait.Extraversion, keyed: 'plus' },
  { id: 42, text: { en: "Am quiet around strangers.", de: "Bin ruhig in der Nähe von Fremden." }, trait: Trait.Extraversion, keyed: 'minus' },

  // --- Agreeableness ---
  { id: 5, text: { en: "Sympathize with others' feelings.", de: "Habe Mitleid mit den Gefühlen anderer." }, trait: Trait.Agreeableness, keyed: 'plus' },
  { id: 6, text: { en: "Am not interested in other people's problems.", de: "Interessiere mich nicht für die Probleme anderer." }, trait: Trait.Agreeableness, keyed: 'minus' },
  { id: 7, text: { en: "Feel others' emotions.", de: "Fühle die Emotionen anderer." }, trait: Trait.Agreeableness, keyed: 'plus' },
  { id: 8, text: { en: "Am not really interested in others.", de: "Interessiere mich nicht wirklich für andere." }, trait: Trait.Agreeableness, keyed: 'minus' },
  { id: 25, text: { en: "Have a soft heart.", de: "Habe ein weiches Herz." }, trait: Trait.Agreeableness, keyed: 'plus' },
  { id: 26, text: { en: "Can be somewhat careless.", de: "Kann etwas unvorsichtig sein." }, trait: Trait.Agreeableness, keyed: 'minus' }, // Contextual mapping for agreeableness/conscientiousness overlap in short scales, mapped here to Ag per Mini-IPIP extensions
  { id: 27, text: { en: "Take time out for others.", de: "Nehme mir Zeit für andere." }, trait: Trait.Agreeableness, keyed: 'plus' },
  { id: 28, text: { en: "Feel little concern for others.", de: "Mache mir wenig Sorgen um andere." }, trait: Trait.Agreeableness, keyed: 'minus' },
  { id: 43, text: { en: "Make people feel at ease.", de: "Sorge dafür, dass sich Leute wohl fühlen." }, trait: Trait.Agreeableness, keyed: 'plus' },
  { id: 44, text: { en: "Insult people.", de: "Beleidige Leute." }, trait: Trait.Agreeableness, keyed: 'minus' },

  // --- Conscientiousness ---
  { id: 9, text: { en: "Get chores done right away.", de: "Erledige Hausarbeiten sofort." }, trait: Trait.Conscientiousness, keyed: 'plus' },
  { id: 10, text: { en: "Often forget to put things back in their proper place.", de: "Vergesse oft, Dinge an ihren Platz zurückzulegen." }, trait: Trait.Conscientiousness, keyed: 'minus' },
  { id: 11, text: { en: "Like order.", de: "Mag Ordnung." }, trait: Trait.Conscientiousness, keyed: 'plus' },
  { id: 12, text: { en: "Make a mess of things.", de: "Mache Unordnung." }, trait: Trait.Conscientiousness, keyed: 'minus' },
  { id: 29, text: { en: "Am always prepared.", de: "Bin immer vorbereitet." }, trait: Trait.Conscientiousness, keyed: 'plus' },
  { id: 30, text: { en: "Leave my belongings around.", de: "Lasse meine Sachen herumliegen." }, trait: Trait.Conscientiousness, keyed: 'minus' },
  { id: 31, text: { en: "Pay attention to details.", de: "Achte auf Details." }, trait: Trait.Conscientiousness, keyed: 'plus' },
  { id: 32, text: { en: "Shirk my duties.", de: "Drücke mich vor meinen Pflichten." }, trait: Trait.Conscientiousness, keyed: 'minus' },
  { id: 45, text: { en: "Follow a schedule.", de: "Folge einem Zeitplan." }, trait: Trait.Conscientiousness, keyed: 'plus' },
  { id: 46, text: { en: "Neglect my duties.", de: "Vernachlässige meine Pflichten." }, trait: Trait.Conscientiousness, keyed: 'minus' },

  // --- Neuroticism ---
  { id: 13, text: { en: "Have frequent mood swings.", de: "Habe häufige Stimmungsschwankungen." }, trait: Trait.Neuroticism, keyed: 'plus' },
  { id: 14, text: { en: "Am relaxed most of the time.", de: "Bin die meiste Zeit entspannt." }, trait: Trait.Neuroticism, keyed: 'minus' },
  { id: 15, text: { en: "Get upset easily.", de: "Reg mich leicht auf." }, trait: Trait.Neuroticism, keyed: 'plus' },
  { id: 16, text: { en: "Seldom feel blue.", de: "Fühle mich selten niedergeschlagen." }, trait: Trait.Neuroticism, keyed: 'minus' },
  { id: 33, text: { en: "Get stressed out easily.", de: "Bin leicht gestresst." }, trait: Trait.Neuroticism, keyed: 'plus' },
  { id: 34, text: { en: "Worry about things.", de: "Mache mir Sorgen um Dinge." }, trait: Trait.Neuroticism, keyed: 'plus' },
  { id: 35, text: { en: "Am easily disturbed.", de: "Bin leicht aus der Ruhe zu bringen." }, trait: Trait.Neuroticism, keyed: 'plus' },
  { id: 36, text: { en: "Rarely get irritated.", de: "Werde selten gereizt." }, trait: Trait.Neuroticism, keyed: 'minus' },
  { id: 47, text: { en: "Change my mood a lot.", de: "Ändere meine Stimmung oft." }, trait: Trait.Neuroticism, keyed: 'plus' },
  { id: 48, text: { en: "Remain calm under pressure.", de: "Bleibe unter Druck ruhig." }, trait: Trait.Neuroticism, keyed: 'minus' },

  // --- Openness ---
  { id: 17, text: { en: "Have a vivid imagination.", de: "Habe eine lebhafte Fantasie." }, trait: Trait.Openness, keyed: 'plus' },
  { id: 18, text: { en: "Am not interested in abstract ideas.", de: "Interessiere mich nicht für abstrakte Ideen." }, trait: Trait.Openness, keyed: 'minus' },
  { id: 19, text: { en: "Have difficulty understanding abstract ideas.", de: "Habe Schwierigkeiten, abstrakte Ideen zu verstehen." }, trait: Trait.Openness, keyed: 'minus' },
  { id: 20, text: { en: "Do not have a good imagination.", de: "Habe keine gute Fantasie." }, trait: Trait.Openness, keyed: 'minus' },
  { id: 37, text: { en: "Have a rich vocabulary.", de: "Habe einen großen Wortschatz." }, trait: Trait.Openness, keyed: 'plus' },
  { id: 38, text: { en: "Spend time reflecting on things.", de: "Verbringe Zeit damit, über Dinge nachzudenken." }, trait: Trait.Openness, keyed: 'plus' },
  { id: 39, text: { en: "Use difficult words.", de: "Benutze schwierige Wörter." }, trait: Trait.Openness, keyed: 'plus' },
  { id: 40, text: { en: "Am full of ideas.", de: "Bin voller Ideen." }, trait: Trait.Openness, keyed: 'plus' },
  { id: 49, text: { en: "Am quick to understand things.", de: "Verstehe Dinge schnell." }, trait: Trait.Openness, keyed: 'plus' },
  { id: 50, text: { en: "Have excellent ideas.", de: "Habe ausgezeichnete Ideen." }, trait: Trait.Openness, keyed: 'plus' },
];

export const QUICK_QUESTIONS = ALL_QUESTIONS.filter(q => q.id <= 20);
export const FULL_QUESTIONS = ALL_QUESTIONS;

export const TRAIT_DETAILS: Record<Trait, TraitDefinition> = {
  [Trait.Openness]: {
    label: { en: "Openness", de: "Offenheit" },
    description: { 
      en: "Creativity, curiosity, and willingness to try new things.", 
      de: "Kreativität, Neugierde und Bereitschaft, Neues auszuprobieren." 
    },
    color: "#8884d8"
  },
  [Trait.Conscientiousness]: {
    label: { en: "Conscientiousness", de: "Gewissenhaftigkeit" },
    description: { 
      en: "Organization, dependability, and discipline.", 
      de: "Organisation, Zuverlässigkeit und Disziplin." 
    },
    color: "#82ca9d"
  },
  [Trait.Extraversion]: {
    label: { en: "Extraversion", de: "Extraversion" },
    description: { 
      en: "Social interaction, energy, and assertiveness.", 
      de: "Soziale Interaktion, Energie und Durchsetzungsvermögen." 
    },
    color: "#ffc658"
  },
  [Trait.Agreeableness]: {
    label: { en: "Agreeableness", de: "Verträglichkeit" },
    description: { 
      en: "Compassion, cooperation, and trust.", 
      de: "Mitgefühl, Kooperation und Vertrauen." 
    },
    color: "#ff7300"
  },
  [Trait.Neuroticism]: {
    label: { en: "Neuroticism", de: "Neurotizismus" },
    description: { 
      en: "Emotional stability vs. negative emotion frequency.", 
      de: "Emotionale Stabilität vs. Häufigkeit negativer Emotionen." 
    },
    color: "#ff4d4f"
  }
};
