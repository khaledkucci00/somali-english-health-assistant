export type LanguageMode = 'en' | 'so' | 'both';

export interface HealthQuestion {
  id: string;
  en: string;
  so: string;
  keywords: string[];
}

export interface HealthCategory {
  id: string;
  nameEn: string;
  nameSo: string;
  iconName: string;
  descriptionEn: string;
  descriptionSo: string;
  questions: HealthQuestion[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  languageMode: LanguageMode;
  timestamp: string;
  categoryHint?: string;
  isEmergencyAlert?: boolean;
}

export interface ChatRequestPayload {
  message: string;
  languageMode: LanguageMode;
  categoryHint?: string;
  history?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface ChatResponsePayload {
  reply: string;
  languageMode: LanguageMode;
  isPotentialEmergency?: boolean;
}
