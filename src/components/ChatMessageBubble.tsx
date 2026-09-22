import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { Volume2, VolumeX, Copy, Check, ShieldAlert, Bot, User } from 'lucide-react';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const isUser = message.sender === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Detect language preference
    if (message.languageMode === 'so') {
      utterance.lang = 'so';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Format message plain text: split into paragraphs while keeping clean linebreaks
  const renderCleanPlainText = (text: string) => {
    return text.split('\n').map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={index} className="h-2" />;
      }

      // Check if line is a clean section title like "ENGLISH:", "AF-SOOMAALI:", "HEALTH EDUCATION:"
      const isHeader =
        /^(ENGLISH:|AF-SOOMAALI:|HEALTH EDUCATION|GENERAL HEALTH|KEY HEALTH TIPS|WHEN TO SEE A DOCTOR|OGEYSIIS|WAXBARASHADA CAAFIMAADKA)/i.test(
          trimmed
        );

      // Check if line is a bullet item like "- Something"
      const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('• ');

      if (isHeader) {
        return (
          <div
            key={index}
            className="font-bold text-slate-900 tracking-wide text-xs uppercase mt-2.5 mb-1 pt-1.5 border-t border-slate-200/60 first:border-0 first:mt-0"
          >
            {trimmed}
          </div>
        );
      }

      if (isBullet) {
        return (
          <div key={index} className="flex items-start gap-1.5 my-0.5 text-xs text-slate-800 leading-relaxed pl-1">
            <span className="text-teal-600 font-bold shrink-0">•</span>
            <span>{trimmed.replace(/^[-•]\s*/, '')}</span>
          </div>
        );
      }

      return (
        <p key={index} className="text-xs text-slate-800 leading-relaxed my-1">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div
      id={`msg-${message.id}`}
      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-3.5 px-3`}
    >
      {/* Sender Info / Avatar Row */}
      <div className="flex items-center gap-1.5 mb-1 px-1">
        {isUser ? (
          <>
            <span className="text-[10px] text-slate-400 font-medium">{message.timestamp}</span>
            <span className="text-[10px] font-semibold text-slate-600">You</span>
            <div className="w-4 h-4 rounded-full bg-slate-700 text-white flex items-center justify-center text-[9px]">
              <User className="w-2.5 h-2.5" />
            </div>
          </>
        ) : (
          <>
            <div className="w-5 h-5 rounded-full bg-teal-700 text-white flex items-center justify-center text-[10px]">
              <Bot className="w-3 h-3" />
            </div>
            <span className="text-[11px] font-bold text-teal-900">Health Assistant</span>
            <span className="text-[10px] text-slate-400 font-medium ml-1">{message.timestamp}</span>
            {message.languageMode && (
              <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium ml-1">
                {message.languageMode === 'both' ? 'EN+SO' : message.languageMode.toUpperCase()}
              </span>
            )}
            {message.isEmergencyAlert && (
              <span className="text-[9px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5 ml-1 border border-rose-200">
                <ShieldAlert className="w-2.5 h-2.5" />
                Emergency Alert
              </span>
            )}
          </>
        )}
      </div>

      {/* Message Bubble Body */}
      <div
        className={`relative max-w-[92%] sm:max-w-[85%] rounded-2xl p-3 text-xs shadow-2xs transition-all ${
          isUser
            ? 'bg-teal-700 text-white rounded-tr-xs font-normal'
            : message.isEmergencyAlert
            ? 'bg-amber-50/90 border border-amber-300 text-slate-900 rounded-tl-xs'
            : 'bg-white border border-slate-200 text-slate-900 rounded-tl-xs'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed text-teal-50">{message.text}</p>
        ) : (
          <div>{renderCleanPlainText(message.text)}</div>
        )}

        {/* Action Toolbar for Assistant Response */}
        {!isUser && (
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
            <span className="italic text-[9px] text-slate-400">General education only</span>
            <div className="flex items-center gap-2">
              {'speechSynthesis' in window && (
                <button
                  type="button"
                  onClick={handleToggleSpeech}
                  className="flex items-center gap-1 text-slate-500 hover:text-teal-700 px-1.5 py-0.5 rounded hover:bg-slate-100 transition-colors"
                  title={isSpeaking ? 'Stop reading' : 'Read aloud'}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-3 h-3 text-rose-600" />
                      <span className="text-rose-600 font-medium">Stop</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3 h-3" />
                      <span>Listen</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-900 px-1.5 py-0.5 rounded hover:bg-slate-100 transition-colors"
                title="Copy response"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
