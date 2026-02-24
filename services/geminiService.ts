import { GoogleGenAI } from "@google/genai";
import { AnalysisRequest, Language, OceanScore } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getOceanAdvice = async (request: AnalysisRequest): Promise<string> => {
  const { scores, category, freeText, language } = request;

  const scoreSummary = Object.entries(scores)
    .map(([trait, score]) => `${trait}: ${score}/100`)
    .join(', ');

  const languageInstruction = language === 'de' 
    ? "Respond strictly in German. Use German headers." 
    : "Respond strictly in English. Use English headers.";

  const userContext = freeText 
    ? `The user has provided the following specific context or question: "${freeText}". Please address this specifically in your advice.` 
    : "";

  const structureInstruction = language === 'de'
    ? `
    Structure the response strictly with the following Markdown headers:
    ## 🧐 Analyse
    (Analyze how the specific trait combination influences this area)
    
    ## 🚧 Mögliche Herausforderungen
    (What problems might arise)
    
    ## 💡 Strategischer Rat
    (High-level approach and advice)
    
    ## 🚀 Praktische Tipps
    (3-4 specific, actionable tactics or hints)
    `
    : `
    Structure the response strictly with the following Markdown headers:
    ## 🧐 Analysis
    (Analyze how the specific trait combination influences this area)
    
    ## 🚧 Potential Challenges
    (What problems might arise)
    
    ## 💡 Strategic Advice
    (High-level approach and advice)
    
    ## 🚀 Actionable Hints
    (3-4 specific, actionable tactics or hints)
    `;

  const prompt = `
    You are an expert personality psychologist. 
    Analyze the following Big Five (OCEAN) personality profile scores:
    ${scoreSummary}

    ${languageInstruction}

    Based on these scores, provide detailed, empathetic, and actionable advice specifically regarding the category: "${category}".
    
    ${userContext}
    
    ${structureInstruction}

    Keep the tone professional but warm. Do not add a general introduction or conclusion outside the headers.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Unable to generate advice at this time.";
  } catch (error) {
    console.error("Error generating advice:", error);
    return language === 'de' 
      ? "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später noch einmal." 
      : "An error occurred while communicating with the AI service. Please try again later.";
  }
};

export const getDeepDiveAnalysis = async (query: string, contextAdvice: string, language: Language): Promise<string> => {
   const prompt = `
     You are a helpful psychology assistant. The user has received the following advice (excerpt):
     "${contextAdvice.substring(0, 2000)}..."

     The user has a follow-up question/request regarding this analysis: "${query}"

     ${language === 'de' ? 'Respond in German.' : 'Respond in English.'}
     Provide a thoughtful, specific answer based on the previous context. Keep it concise (under 200 words) but helpful.
   `;

   try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    console.error(error);
    return language === 'de' ? "Konnte keine Antwort generieren." : "Could not generate answer.";
  }
};

export const getPartnershipAdvice = async (
  scoresA: OceanScore, 
  scoresB: OceanScore, 
  nameA: string, 
  nameB: string, 
  language: Language,
  context?: string
): Promise<string> => {
  const summaryA = Object.entries(scoresA).map(([t, s]) => `${t}: ${s}`).join(', ');
  const summaryB = Object.entries(scoresB).map(([t, s]) => `${t}: ${s}`).join(', ');

  const languageInstruction = language === 'de' 
    ? "Respond strictly in German. Use German headers." 
    : "Respond strictly in English. Use English headers.";

  const userContext = context
    ? `The user has provided specific context for this partnership: "${context}". Analyze the relationship dynamics with this context in mind.`
    : "";

  const structureInstruction = language === 'de'
    ? `
    Structure the response strictly with the following Markdown headers:
    ## 🤝 Beziehungsdynamik
    (Overview of how these two personalities interact generally)
    
    ## ✨ Synergien & Stärken
    (Where they complement each other)
    
    ## ⚡ Potenzielle Konfliktpunkte
    (Where friction is likely based on trait differences or similarities)
    
    ## 💬 Kommunikationstipps
    (How they can talk to each other more effectively)
    `
    : `
    Structure the response strictly with the following Markdown headers:
    ## 🤝 Relationship Dynamics
    (Overview of how these two personalities interact generally)
    
    ## ✨ Synergies & Strengths
    (Where they complement each other)
    
    ## ⚡ Potential Conflict Points
    (Where friction is likely based on trait differences or similarities)
    
    ## 💬 Communication Tips
    (How they can talk to each other more effectively)
    `;

  const prompt = `
    You are an expert in relationship psychology and the Big Five model.
    Analyze the compatibility and dynamics between two individuals:

    ${nameA}: ${summaryA}
    ${nameB}: ${summaryB}

    ${languageInstruction}

    ${userContext}

    Provide a comparative analysis of their partnership.
    ${structureInstruction}

    Keep the tone objective, constructive, and empathetic. Focus on growth and understanding.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Unable to generate partnership analysis.";
  } catch (error) {
    console.error(error);
    return language === 'de' ? "Fehler bei der Analyse." : "Error generating analysis.";
  }
};