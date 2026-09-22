import React from 'react';
import { LanguageMode } from '../types';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  currentMode: LanguageMode;
  onChange: (mode: LanguageMode) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentMode, onChange }) => {
  const options: Array<{ id: LanguageMode; labelEn: string; labelSo: string; badge: string }> = [
    { id: 'en', labelEn: 'English', labelSo: 'Ingiriis', badge: 'EN' },
    { id: 'so', labelEn: 'Somali', labelSo: 'Af-Soomaali', badge: 'SO' },
    { id: 'both', labelEn: 'English + Somali', labelSo: 'Labadaba', badge: 'EN+SO' },
  ];

  return (
    <div id="language-selector-container" className="px-3 py-1.5 bg-slate-50 border-b border-slate-200">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
          <Globe className="w-3.5 h-3.5 text-teal-600" />
          <span>Language / Luqadda:</span>
        </div>
        <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-semibold border border-teal-200">
          {currentMode === 'both' ? 'Bilingual Mode' : currentMode === 'so' ? 'Af-Soomaali' : 'English Only'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1 p-0.5 bg-slate-200 rounded-lg">
        {options.map((opt) => {
          const isActive = currentMode === opt.id;
          return (
            <button
              key={opt.id}
              id={`lang-btn-${opt.id}`}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`py-1.5 px-2 rounded-md text-xs font-medium transition-all flex flex-col items-center justify-center leading-tight ${
                isActive
                  ? 'bg-white text-teal-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <span className="truncate">{opt.labelEn}</span>
              <span className="text-[9px] opacity-75">{opt.labelSo}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
