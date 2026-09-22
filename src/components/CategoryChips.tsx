import React from 'react';
import { HEALTH_CATEGORIES } from '../data/healthCategories';
import { HealthCategory, LanguageMode } from '../types';
import { Baby, Apple, HeartPulse, ShieldAlert, Smile, Sparkles } from 'lucide-react';

interface CategoryChipsProps {
  selectedCategoryId: string | null;
  onSelectCategory: (category: HealthCategory) => void;
  languageMode: LanguageMode;
  onOpenAllDataset: () => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategoryId,
  onSelectCategory,
  languageMode,
  onOpenAllDataset,
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Baby':
        return <Baby className="w-3.5 h-3.5" />;
      case 'Apple':
        return <Apple className="w-3.5 h-3.5" />;
      case 'HeartPulse':
        return <HeartPulse className="w-3.5 h-3.5" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-3.5 h-3.5" />;
      case 'Smile':
        return <Smile className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div id="health-categories-bar" className="bg-white border-b border-slate-200 px-3 py-2">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
          <span>
            {languageMode === 'so'
              ? 'Qaybaha Waxbarashada Caafimaadka (5 Qaybood)'
              : languageMode === 'en'
              ? 'Health Education Categories (5 Areas)'
              : '5 Health Categories / Qaybood'}
          </span>
        </div>
        <button
          id="btn-open-dataset"
          type="button"
          onClick={onOpenAllDataset}
          className="text-[10px] font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100/70 px-2 py-0.5 rounded border border-teal-200 transition-colors flex items-center gap-1"
        >
          <span>50 Test Questions</span>
        </button>
      </div>

      {/* Horizontal scrollable category pill chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {HEALTH_CATEGORIES.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          const label =
            languageMode === 'so'
              ? category.nameSo
              : languageMode === 'en'
              ? category.nameEn
              : `${category.nameEn} (${category.nameSo})`;

          return (
            <button
              key={category.id}
              id={`cat-chip-${category.id}`}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                isSelected
                  ? 'bg-teal-700 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <span className={isSelected ? 'text-teal-200' : 'text-teal-600'}>
                {getCategoryIcon(category.iconName)}
              </span>
              <span>{label}</span>
              <span
                className={`text-[9px] px-1 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-teal-800 text-teal-100' : 'bg-slate-200 text-slate-600'
                }`}
              >
                10
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
