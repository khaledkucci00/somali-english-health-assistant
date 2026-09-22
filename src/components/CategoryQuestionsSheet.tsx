import React from 'react';
import { HealthCategory, LanguageMode } from '../types';
import { X, Send, HelpCircle, ChevronRight } from 'lucide-react';

interface CategoryQuestionsSheetProps {
  category: HealthCategory | null;
  onClose: () => void;
  onSelectQuestion: (questionText: string, categoryHint: string) => void;
  languageMode: LanguageMode;
}

export const CategoryQuestionsSheet: React.FC<CategoryQuestionsSheetProps> = ({
  category,
  onClose,
  onSelectQuestion,
  languageMode,
}) => {
  if (!category) return null;

  const handleAsk = (qEn: string, qSo: string) => {
    let textToAsk = qEn;
    if (languageMode === 'so') {
      textToAsk = qSo;
    } else if (languageMode === 'both') {
      textToAsk = `${qEn} / ${qSo}`;
    }
    onSelectQuestion(textToAsk, `${category.nameEn} (${category.nameSo})`);
    onClose();
  };

  return (
    <div
      id="category-questions-drawer-backdrop"
      className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-2xs flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div
        id="category-questions-drawer"
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[82vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom duration-200"
      >
        {/* Drawer Header */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex-1 pr-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
              <HelpCircle className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="truncate">{category.nameEn}</span>
            </div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">{category.nameSo}</p>
          </div>
          <button
            id="btn-close-category-sheet"
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Description Banner */}
        <div className="px-4 py-2 bg-teal-50/60 border-b border-teal-100 text-[11px] text-teal-900">
          <p>{languageMode === 'so' ? category.descriptionSo : category.descriptionEn}</p>
          <span className="text-[10px] font-semibold text-teal-700 mt-1 inline-block">
            10 Example Questions (Tap to ask assistant):
          </span>
        </div>

        {/* 10 Questions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-slate-100">
          {category.questions.map((q, idx) => (
            <button
              key={q.id}
              id={`cat-q-btn-${q.id}`}
              type="button"
              onClick={() => handleAsk(q.en, q.so)}
              className="w-full text-left pt-2 first:pt-0 p-2 rounded-xl hover:bg-teal-50/50 transition-colors flex items-start justify-between gap-2 group"
            >
              <div className="flex-1 pr-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                  <span className="text-xs font-medium text-slate-900 group-hover:text-teal-900 leading-snug">
                    {languageMode === 'so' ? q.so : q.en}
                  </span>
                </div>
                {languageMode === 'both' && (
                  <p className="text-[11px] text-teal-800/80 leading-snug pl-4">
                    {q.so}
                  </p>
                )}
                {languageMode === 'en' && (
                  <p className="text-[10px] text-slate-400 leading-snug pl-4">
                    Somali: {q.so}
                  </p>
                )}
                {languageMode === 'so' && (
                  <p className="text-[10px] text-slate-400 leading-snug pl-4">
                    English: {q.en}
                  </p>
                )}
              </div>

              <div className="p-1 rounded-md text-slate-400 group-hover:text-teal-700 group-hover:bg-teal-100 shrink-0 mt-0.5">
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-400">
          Educational prompts • Tap any question to get an immediate bilingual explanation
        </div>
      </div>
    </div>
  );
};
