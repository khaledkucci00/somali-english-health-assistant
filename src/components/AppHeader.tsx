import React from 'react';
import { Activity, RotateCcw, Info, BookOpen } from 'lucide-react';
import { LanguageMode } from '../types';

interface AppHeaderProps {
  languageMode: LanguageMode;
  onResetChat: () => void;
  onOpenAbout: () => void;
  onOpenDataset: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  languageMode,
  onResetChat,
  onOpenAbout,
  onOpenDataset,
}) => {
  return (
    <header id="mobile-app-header" className="bg-teal-800 text-white px-3.5 py-2.5 shadow-xs shrink-0 select-none">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-teal-600/80 border border-teal-400/40 flex items-center justify-center text-teal-100 shadow-2xs shrink-0">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold tracking-tight text-white truncate leading-tight">
              Somali English Health Assistant
            </h1>
            <p className="text-[10px] text-teal-200 truncate leading-none mt-0.5">
              {languageMode === 'so'
                ? 'Kaaliyaha Waxbarashada Caafimaadka ee Labada Luqadood'
                : languageMode === 'en'
                ? 'Bilingual Health Education & Safety'
                : 'Bilingual Education • Af-Soomaali & English'}
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            id="btn-open-dataset-header"
            type="button"
            onClick={onOpenDataset}
            className="p-1.5 text-teal-100 hover:text-white hover:bg-teal-700/70 rounded-lg transition-colors"
            title="50 Educational Questions / Test Dataset"
            aria-label="50 Educational Questions"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <button
            id="btn-open-about-modal"
            type="button"
            onClick={onOpenAbout}
            className="p-1.5 text-teal-100 hover:text-white hover:bg-teal-700/70 rounded-lg transition-colors"
            title="About & Medical Guidelines"
            aria-label="About and Safety Rules"
          >
            <Info className="w-4 h-4" />
          </button>

          <button
            id="btn-reset-chat-header"
            type="button"
            onClick={onResetChat}
            className="p-1.5 text-teal-100 hover:text-white hover:bg-teal-700/70 rounded-lg transition-colors"
            title="Reset Chat / Nadiifi Wadahadalka"
            aria-label="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
