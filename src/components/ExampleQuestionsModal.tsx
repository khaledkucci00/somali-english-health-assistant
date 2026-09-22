import React, { useState, useMemo } from 'react';
import { HEALTH_CATEGORIES } from '../data/healthCategories';
import { HealthCategory, HealthQuestion, LanguageMode } from '../types';
import { X, Search, Send, Check, Sparkles, Filter, ChevronRight, BookOpen } from 'lucide-react';

interface ExampleQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuestion: (questionText: string, categoryHint: string) => void;
  currentLanguageMode: LanguageMode;
}

export const ExampleQuestionsModal: React.FC<ExampleQuestionsModalProps> = ({
  isOpen,
  onClose,
  onSelectQuestion,
  currentLanguageMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('all');
  const [displayLanguage, setDisplayLanguage] = useState<'current' | 'en' | 'so' | 'both'>('current');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const effectiveLang = displayLanguage === 'current' ? currentLanguageMode : displayLanguage;

  // Flatten and filter questions
  const filteredList = useMemo(() => {
    const list: Array<{ category: HealthCategory; question: HealthQuestion; index: number }> = [];

    HEALTH_CATEGORIES.forEach((cat) => {
      if (selectedCatFilter !== 'all' && cat.id !== selectedCatFilter) {
        return;
      }
      cat.questions.forEach((q, idx) => {
        const matchesSearch =
          !searchQuery.trim() ||
          q.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.so.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase())) ||
          cat.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.nameSo.toLowerCase().includes(searchQuery.toLowerCase());

        if (matchesSearch) {
          list.push({ category: cat, question: q, index: idx + 1 });
        }
      });
    });

    return list;
  }, [selectedCatFilter, searchQuery]);

  if (!isOpen) return null;

  const handleAsk = (q: HealthQuestion, cat: HealthCategory) => {
    // Choose prompt based on current language
    let textToAsk = q.en;
    if (currentLanguageMode === 'so') {
      textToAsk = q.so;
    } else if (currentLanguageMode === 'both') {
      textToAsk = `${q.en} / ${q.so}`;
    }
    onSelectQuestion(textToAsk, `${cat.nameEn} (${cat.nameSo})`);
    onClose();
  };

  const handleCopy = (q: HealthQuestion) => {
    const text = `${q.en}\n${q.so}`;
    navigator.clipboard.writeText(text);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div
      id="test-dataset-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div
        id="test-dataset-modal-content"
        className="bg-white rounded-2xl w-full max-w-lg max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-teal-600 text-white rounded-lg">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Educational Examples & Test Dataset
              </h3>
              <p className="text-[11px] text-slate-500">
                50 Verified Questions across 5 Health Categories
              </p>
            </div>
          </div>
          <button
            id="btn-close-dataset-modal"
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Language Display Toggle */}
        <div className="p-3 border-b border-slate-100 bg-white space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="input-dataset-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 50 health questions (e.g. malaria, fever, breastfeed)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            <button
              type="button"
              onClick={() => setSelectedCatFilter('all')}
              className={`px-2 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
                selectedCatFilter === 'all'
                  ? 'bg-teal-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All (50)
            </button>
            {HEALTH_CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCatFilter(c.id)}
                className={`px-2 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
                  selectedCatFilter === c.id
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.nameEn} (10)
              </button>
            ))}
          </div>
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-100">
          {filteredList.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No matching questions found for "{searchQuery}".
            </div>
          ) : (
            filteredList.map(({ category, question, index }) => (
              <div
                key={question.id}
                id={`dataset-card-${question.id}`}
                className="pt-2.5 first:pt-0 group hover:bg-slate-50 p-2 rounded-xl transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    {category.nameEn} #{index}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(question)}
                      className="text-[10px] text-slate-500 hover:text-slate-800 px-1.5 py-0.5 rounded hover:bg-slate-200/60"
                      title="Copy Question Text"
                    >
                      {copiedId === question.id ? (
                        <span className="text-emerald-600 flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Copied
                        </span>
                      ) : (
                        'Copy'
                      )}
                    </button>
                    <button
                      id={`btn-ask-${question.id}`}
                      type="button"
                      onClick={() => handleAsk(question, category)}
                      className="flex items-center gap-1 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 px-2.5 py-1 rounded-lg shadow-2xs transition-transform active:scale-95"
                    >
                      <span>Ask</span>
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* English Question */}
                <div className="text-xs text-slate-900 font-medium leading-relaxed">
                  <span className="text-[10px] uppercase font-bold text-slate-400 mr-1.5">EN:</span>
                  {question.en}
                </div>

                {/* Somali Question */}
                <div className="text-xs text-teal-900/90 font-medium leading-relaxed mt-1">
                  <span className="text-[10px] uppercase font-bold text-teal-600 mr-1.5">SO:</span>
                  {question.so}
                </div>

                {/* Keywords */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {question.keywords.map((kw, kidx) => (
                    <span
                      key={kidx}
                      className="text-[9px] bg-slate-200/70 text-slate-600 px-1.5 py-0.2 rounded"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredList.length} of 50 questions</span>
          <span className="text-[11px] text-slate-400">
            Educational dataset & testing prompts
          </span>
        </div>
      </div>
    </div>
  );
};
