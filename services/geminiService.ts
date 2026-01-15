import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DailyPhrase, PronunciationFeedback, EnglishLevel } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to determine difficulty based on level number
const getLevelContext = (level: string) => {
  const num = parseInt(level.replace(/\D/g, '')) || 1;
  
  if (num <= 3) return "Nível Iniciante Absoluto (A1). Foco em palavras isoladas, saudações, cores e números. Fale 90% Português.";
  if (num <= 10) return "Nível Básico (A2). Frases curtas, verbo to be, presente simples. Misture Inglês e Português.";
  if (num <= 25) return "Nível Intermediário (B1). Rotina, passado, planos futuros. Foco em conversação. Fale 70% Inglês.";
  if (num <= 40) return "Nível Avançado (B2). Discussões sobre opiniões, sentimentos e notícias. Fale 90% Inglês.";
  return "Nível Fluente/Nativo (C1+). Expressões idiomáticas, ironia, temas complexos. Fale 100% Inglês.";
};

const getLevelTopic = (level: string) => {
    const num = parseInt(level.replace(/\D/g, '')) || 1;
    const topics = [
        "Saudações", "Comida", "Viagem", "Animais", "Família", "Cores", "Roupas", "Trabalho",
        "Escola", "Esportes", "Música", "Filmes", "Tecnologia", "Natureza", "Saúde", "Casa",
        "Cidade", "Dinheiro", "Tempo", "Sentimentos"
    ];
    return topics[(num - 1) % topics.length];
}

const getChatSystemInstruction = (level: EnglishLevel) => {
  const context = getLevelContext(level);
  return `Você é o "LinguAI", um tutor de inglês divertido e gamificado. 
  Nível atual do aluno: ${level}.
  Contexto Pedagógico: ${context}
  Sempre dê feedback positivo, correções gentis e use emojis.`;
};

export const getDailyLesson = async (level: EnglishLevel): Promise<DailyPhrase[]> => {
  const model = "gemini-3-flash-preview";
  const context = getLevelContext(level);
  const topic = getLevelTopic(level);
  
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        phrase: { type: Type.STRING, description: "The phrase in English" },
        translation: { type: Type.STRING, description: "Portuguese translation" },
        explanation: { type: Type.STRING, description: "Grammar or vocabulary explanation in Portuguese" },
        pronunciationTips: { type: Type.STRING, description: "Tips on how to pronounce it for Portuguese speakers" }
      },
      required: ["phrase", "translation", "explanation", "pronunciationTips"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Gere 3 frases para ensinar inglês. Nível: ${level}. Tópico sugerido: ${topic}. 
      Contexto: ${context}.
      As frases devem ser progressivamente mais difíceis conforme o nível aumenta.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "Você é um gerador de lições de inglês gamificado."
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as DailyPhrase[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching daily lesson:", error);
    throw error;
  }
};

export const chatWithTutor = async (history: {role: string, parts: {text: string}[]}[], message: string, level: EnglishLevel) => {
  const model = "gemini-3-flash-preview";
  
  try {
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: getChatSystemInstruction(level),
      },
      history: history
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Error in chat:", error);
    return "Ops, tive um problema. Tente de novo! 🦉";
  }
};

export const analyzePronunciation = async (audioBase64: string, mimeType: string, targetPhrase: string, level: EnglishLevel): Promise<PronunciationFeedback> => {
  const model = "gemini-2.5-flash-native-audio-preview-12-2025";

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.INTEGER, description: "Score from 0 to 100" },
      feedback: { type: Type.STRING, description: "Detailed feedback in Portuguese" },
      correction: { type: Type.STRING, description: "Phonetic correction" }
    },
    required: ["score", "feedback", "correction"]
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: audioBase64
            }
          },
          {
            text: `Avalie a pronúncia da frase: "${targetPhrase}" para um aluno do nível ${level}. Responda em Português com dicas úteis.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as PronunciationFeedback;
    }
    throw new Error("No response");
  } catch (error) {
    console.error("Error analyzing audio:", error);
    return {
      score: 0,
      feedback: "Não consegui ouvir com clareza. Tente novamente em um local silencioso.",
      correction: ""
    };
  }
};