export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface DailyPhrase {
  phrase: string;
  translation: string;
  explanation: string;
  pronunciationTips: string;
}

export interface PronunciationFeedback {
  score: number; // 0-100
  feedback: string;
  correction: string;
}

export enum AppTab {
  DAILY = 'daily',
  CHAT = 'chat',
  PRONUNCIATION = 'pronunciation'
}