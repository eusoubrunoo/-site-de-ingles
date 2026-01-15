import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DailyPhrase, PronunciationFeedback } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// System instruction for the Chat Persona
const CHAT_SYSTEM_INSTRUCTION = `
Você é o "LinguAI", um professor de inglês amigável e paciente para falantes de português.
Seu método é a "Imersão Gradual".
1. Comece falando principalmente em português, introduzindo palavras em inglês chave.
2. À medida que a conversa avança, use mais inglês, mas sempre explique palavras novas ou complexas entre parênteses ou logo após.
3. Se o usuário estiver confuso, volte para o português.
4. Se o usuário pedir tradução, forneça-a claramente.
5. Seja encorajador e corrija erros gramaticais de forma sutil.
6. Mantenha as respostas concisas e conversacionais.
`;

export const getDailyLesson = async (): Promise<DailyPhrase[]> => {
  const model = "gemini-3-flash-preview";
  
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
      contents: "Gere 3 frases úteis e comuns em inglês para um iniciante aprender hoje. Foque em situações do cotidiano (viagem, trabalho, cumprimentos).",
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "Você é um gerador de lições de inglês experiente."
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

export const chatWithTutor = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  const model = "gemini-3-flash-preview";
  
  try {
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: CHAT_SYSTEM_INSTRUCTION,
      },
      history: history
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Error in chat:", error);
    return "Desculpe, estou tendo problemas para conectar. Tente novamente.";
  }
};

export const analyzePronunciation = async (audioBase64: string, mimeType: string, targetPhrase: string): Promise<PronunciationFeedback> => {
  // Using native audio preview model for best audio understanding
  const model = "gemini-2.5-flash-native-audio-preview-12-2025";

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.INTEGER, description: "Score from 0 to 100 representing pronunciation accuracy" },
      feedback: { type: Type.STRING, description: "Detailed feedback in Portuguese about specific sounds the user missed or got right." },
      correction: { type: Type.STRING, description: "Phonetic representation or tip to improve." }
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
            text: `O usuário está tentando dizer a frase: "${targetPhrase}". Avalie a pronúncia. Seja gentil, fale português.`
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
    throw new Error("No response from AI");
  } catch (error) {
    console.error("Error analyzing audio:", error);
    return {
      score: 0,
      feedback: "Erro ao processar áudio. Tente falar mais claro ou verifique seu microfone.",
      correction: ""
    };
  }
};