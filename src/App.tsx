import React, { useState, useEffect, useRef } from 'react';
import { MobileFrame } from './components/MobileFrame';
import { StatusBar } from './components/StatusBar';
import { AppHeader } from './components/AppHeader';
import { LanguageSelector } from './components/LanguageSelector';
import { EmergencyNotice } from './components/EmergencyNotice';
import { CategoryChips } from './components/CategoryChips';
import { CategoryQuestionsSheet } from './components/CategoryQuestionsSheet';
import { ExampleQuestionsModal } from './components/ExampleQuestionsModal';
import { ChatMessageBubble } from './components/ChatMessageBubble';
import { AboutModal } from './components/AboutModal';
import { HEALTH_CATEGORIES } from './data/healthCategories';
import { ChatMessage, HealthCategory, LanguageMode } from './types';
import { Send, Sparkles, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';

const INITIAL_GREETING_MESSAGE = (mode: LanguageMode): string => {
  if (mode === 'en') {
    return `Hello and welcome. I am your Somali English Health Assistant.

I provide general health education, prevention tips, and wellness information in English and Somali.

IMPORTANT MEDICAL SAFETY:
- I provide educational health information only.
- I do not diagnose illnesses or conditions.
- I do not prescribe medications or recommend dosages.
- Always consult a licensed physician, doctor, or local clinic for professional medical evaluation and treatment.
- If you face a severe medical emergency, please visit the nearest hospital or call emergency services immediately.

How can I help you today? You can choose one of the 5 categories above, browse the 50 example questions, or type your own question below.`;
  }

  if (mode === 'so') {
    return `Kusoo dhawoow Kaaliyaha Caafimaadka ee Af-Soomaaliga iyo Ingiriiska.

Waxaan kuugu adeegayaa wacyigelin caafimaad, talooyinka ka-hortagga cudurrada, iyo aqoonta fayo-qabka.

OGEYSIIS KU SAABSAN BADBAADADA CAAFIMAADKA:
- Waxaan bixiyaa waxbarasho iyo wacyigelin caafimaad oo guud oo keliya.
- Ma baaro cudurro mana sheego waxa qofku qabo (diagnosis).
- Ma qoro dawooyin mana gooyo xaddiga kaniiniyada (dosages).
- Mar kasta la xiriir dhaqtar aqoon u leh ama xarun caafimaad si laguu siiyo daryeel caafimaad oo dhab ah.
- Xaaladaha degdegga ah, fadlan degdeg u tag isbitaalka ugu dhow ama la xiriir adeegga gurmadka degdegga ah.

Sideen kuu caawin karaa maanta? Waxaad dooran kartaa mid ka mid ah 5-ta qaybood ee sare, ama waxaad weydiin kartaa su'aashaada gaarka ah hoos.`;
  }

  return `ENGLISH:
Welcome to the Somali English Health Assistant. I provide general health education, wellness awareness, and disease prevention guidance in English and Somali.

IMPORTANT MEDICAL SAFETY:
- I provide educational information only.
- I do not diagnose illnesses or conditions.
- I do not prescribe medications or recommend dosages.
- Always consult a licensed physician or clinic for professional clinical evaluation.
- For life-threatening emergencies, visit the nearest hospital or call emergency services immediately.

AF-SOOMAALI:
Kusoo dhawoow Kaaliyaha Caafimaadka ee Af-Soomaaliga iyo Ingiriiska. Waxaan bixiyaa waxbarasho caafimaad iyo talooyin ku saabsan fayo-qabka iyo ka-hortagga cudurrada.

OGEYSIIS KU SAABSAN BADBAADADA CAAFIMAADKA:
- Waxaan bixiyaa waxbarasho caafimaad oo guud oo keliya.
- Ma baaro mana sheego cudurrada (diagnosis).
- Ma qoro dawooyin mana bixiyo xaddiga qiyaasta dawooyinka (dosages).
- Mar kasta la tasho dhaqtar shati haysta ama xarun caafimaad.
- Xaaladaha degdegga ah, fadlan degdeg u tag isbitaalka ugu dhow.`;
};

export default function App() {
  const [languageMode, setLanguageMode] = useState<LanguageMode>('both');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals & Drawers state
  const [selectedCategory, setSelectedCategory] = useState<HealthCategory | null>(null);
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Initialize greeting on mount or when language mode is switched if only welcome message exists
  useEffect(() => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const initialMsg: ChatMessage = {
      id: 'welcome-msg',
      sender: 'assistant',
      text: INITIAL_GREETING_MESSAGE(languageMode),
      languageMode,
      timestamp: timeNow,
    };

    setMessages((prev) => {
      if (prev.length === 0 || (prev.length === 1 && prev[0].id === 'welcome-msg')) {
        return [initialMsg];
      }
      return prev;
    });
  }, [languageMode]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Send message to server
  const handleSendMessage = async (textToSend?: string, categoryHint?: string) => {
    const rawText = textToSend || inputText;
    if (!rawText.trim() || isLoading) return;

    const trimmed = rawText.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // User message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      languageMode,
      timestamp: timeNow,
      categoryHint,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setErrorMsg(null);
    setIsLoading(true);

    try {
      // Build conversation history for context
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome-msg')
        .slice(-6)
        .map((m) => ({
          role: m.sender,
          content: m.text,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          languageMode,
          categoryHint,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Thank you for your question. Please consult a licensed doctor for clinical advice.',
        languageMode: data.languageMode || languageMode,
        timestamp: replyTime,
        isEmergencyAlert: Boolean(data.isPotentialEmergency),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMsg(
        languageMode === 'so'
          ? 'Khalad ayaa dhacay. Fadlan hubi xiriirkaaga oo mar kale isku day.'
          : 'Unable to connect to assistant service. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([
      {
        id: 'welcome-msg',
        sender: 'assistant',
        text: INITIAL_GREETING_MESSAGE(languageMode),
        languageMode,
        timestamp: timeNow,
      },
    ]);
    setErrorMsg(null);
  };

  // Sample quick prompt chips when chat has only greeting
  const samplePrompts = [
    {
      en: 'What are the benefits of exclusive breastfeeding?',
      so: 'Waa maxay faa’iidooyinka naas-nuujinta keliya?',
      cat: 'Maternal & Child Health',
    },
    {
      en: 'How can we prevent malaria and mosquito bites?',
      so: 'Sidee looga hortagaa qaniinyada kaneecada iyo duumada?',
      cat: 'Infectious Diseases',
    },
    {
      en: 'What habits help keep blood pressure in a healthy range?',
      so: 'Waa maxay caadooyinka lagu ilaalin karo dhiig-karka?',
      cat: 'Chronic Disease Prevention',
    },
  ];

  return (
    <MobileFrame>
      {/* Mobile Top Status Bar */}
      <StatusBar />

      {/* Main Mobile App Header */}
      <AppHeader
        languageMode={languageMode}
        onResetChat={handleResetChat}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onOpenDataset={() => setIsDatasetModalOpen(true)}
      />

      {/* Language Selection: English / Somali / English + Somali */}
      <LanguageSelector
        currentMode={languageMode}
        onChange={(newMode) => setLanguageMode(newMode)}
      />

      {/* Prominent Emergency Safety Notice */}
      <EmergencyNotice languageMode={languageMode} />

      {/* 5 Health Education Categories Bar */}
      <CategoryChips
        selectedCategoryId={selectedCategory ? selectedCategory.id : null}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        languageMode={languageMode}
        onOpenAllDataset={() => setIsDatasetModalOpen(true)}
      />

      {/* Chat Messages Container */}
      <div
        id="chat-messages-scroll-area"
        className="flex-1 overflow-y-auto pt-3 pb-2 px-1 bg-slate-50/70 space-y-1 select-text"
      >
        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}

        {/* Loading Spinner / Typing State */}
        {isLoading && (
          <div className="flex items-center gap-2 px-4 py-2 text-xs text-teal-800 bg-teal-50/80 rounded-xl mx-3 w-fit border border-teal-200">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
            <span className="font-medium">
              {languageMode === 'so'
                ? 'Kaaliyaha ayaa diyaarinaya macluumaadka caafimaadka...'
                : languageMode === 'en'
                ? 'Health Assistant is preparing your medical education guidance...'
                : 'Preparing bilingual health guidance in English & Somali...'}
            </span>
          </div>
        )}

        {/* Error notice if fetch failed */}
        {errorMsg && (
          <div className="mx-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="flex-1">{errorMsg}</span>
          </div>
        )}

        {/* Initial Suggestion Prompts if only welcome message is present */}
        {messages.length === 1 && (
          <div className="px-3 pt-2 pb-1 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-600" />
              <span>
                {languageMode === 'so'
                  ? 'Tusaalooyin Degdeg ah oo aad Weydiin karto:'
                  : 'Quick Example Questions to Try:'}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  id={`sample-prompt-${idx}`}
                  type="button"
                  onClick={() =>
                    handleSendMessage(
                      languageMode === 'so' ? p.so : languageMode === 'en' ? p.en : `${p.en} / ${p.so}`,
                      p.cat
                    )
                  }
                  className="text-left p-2 rounded-xl bg-white border border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 transition-all text-xs text-slate-800 flex items-center justify-between group shadow-2xs"
                >
                  <span className="font-medium text-slate-800 group-hover:text-teal-900 leading-snug">
                    {languageMode === 'so' ? p.so : p.en}
                  </span>
                  <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-medium shrink-0 ml-2">
                    Ask
                  </span>
                </button>
              ))}

              <button
                id="btn-view-all-50-questions"
                type="button"
                onClick={() => setIsDatasetModalOpen(true)}
                className="text-center p-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 transition-colors text-xs font-semibold flex items-center justify-center gap-1.5 mt-1"
              >
                <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                <span>Browse All 50 Educational Questions & Test Dataset</span>
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer Area */}
      <div id="chat-input-composer" className="p-2.5 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-end gap-2 bg-slate-100 rounded-2xl p-1.5 border border-slate-300 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100 transition-all"
        >
          <textarea
            ref={inputRef}
            id="chat-user-input"
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              languageMode === 'so'
                ? 'Weydii su’aal caafimaad oo kasta...'
                : languageMode === 'en'
                ? 'Ask any health education question...'
                : 'Ask any question / Weydii su’aal...'
            }
            className="flex-1 bg-transparent resize-none px-2 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none max-h-24 leading-relaxed"
          />

          <button
            id="btn-send-message"
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`p-2 rounded-xl text-white transition-all shrink-0 ${
              inputText.trim() && !isLoading
                ? 'bg-teal-700 hover:bg-teal-800 active:scale-95 shadow-xs'
                : 'bg-slate-300 cursor-not-allowed text-slate-400'
            }`}
            title="Send question"
            aria-label="Send question"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Safety Micro-Notice */}
        <div className="mt-1.5 text-center text-[10px] text-slate-400 leading-tight">
          Educational guidance only • Does not diagnose or prescribe • Consult a doctor
        </div>
      </div>

      {/* Category 10 Questions Sheet */}
      <CategoryQuestionsSheet
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
        onSelectQuestion={(qText, catHint) => handleSendMessage(qText, catHint)}
        languageMode={languageMode}
      />

      {/* 50 Questions Test Dataset Modal */}
      <ExampleQuestionsModal
        isOpen={isDatasetModalOpen}
        onClose={() => setIsDatasetModalOpen(false)}
        onSelectQuestion={(qText, catHint) => handleSendMessage(qText, catHint)}
        currentLanguageMode={languageMode}
      />

      {/* About & Safety Rules Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        languageMode={languageMode}
      />
    </MobileFrame>
  );
}
