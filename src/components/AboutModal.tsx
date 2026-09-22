import React from 'react';
import { X, ShieldCheck, AlertOctagon, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { LanguageMode } from '../types';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  languageMode: LanguageMode;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, languageMode }) => {
  if (!isOpen) return null;

  return (
    <div
      id="about-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div
        id="about-modal-content"
        className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="px-4 py-3 bg-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-300" />
            <div>
              <h3 className="text-sm font-bold leading-tight">
                {languageMode === 'so'
                  ? 'Ku Saabsan Kaaliyaha Caafimaadka'
                  : 'About Somali English Health Assistant'}
              </h3>
              <p className="text-[10px] text-teal-200">
                Ethical Health Education & Clinical Boundaries
              </p>
            </div>
          </div>
          <button
            id="btn-close-about-modal"
            type="button"
            onClick={onClose}
            className="p-1 text-teal-200 hover:text-white hover:bg-teal-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs text-slate-700">
          {/* Mission */}
          <div className="bg-teal-50 p-3 rounded-xl border border-teal-200 text-teal-950">
            <h4 className="font-bold text-xs text-teal-900 mb-1 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-teal-700" />
              <span>Bilingual Health Mission / Hadafka Caafimaadka</span>
            </h4>
            <p className="leading-relaxed text-[11px]">
              The Somali English Health Assistant bridges critical language barriers by providing reliable,
              easy-to-understand health education in English and Somali (Af-Soomaali).
            </p>
          </div>

          {/* Strict Medical Guardrails */}
          <div>
            <h4 className="font-bold text-xs text-slate-900 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              <span>Core Medical Safety Boundaries</span>
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-[11px]">General Health Education Only:</strong>
                  <span className="text-[11px] text-slate-600">
                    Provides factual wellness awareness, lifestyle habits, and prevention advice.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-[11px]">No Medical Diagnoses:</strong>
                  <span className="text-[11px] text-slate-600">
                    Never diagnoses illnesses, conditions, or specific medical complaints.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-[11px]">No Prescriptions or Dosages:</strong>
                  <span className="text-[11px] text-slate-600">
                    Does not prescribe drugs or recommend milligram doses. Only licensed clinicians may prescribe.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-[11px]">Professional Care Referral:</strong>
                  <span className="text-[11px] text-slate-600">
                    Clearly directs individuals to qualified doctors, clinics, and hospitals for in-person care.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-[11px]">Consistent & Clean Plain Text:</strong>
                  <span className="text-[11px] text-slate-600">
                    Maintains medical consistency between English and Somali, formatted in clean plain text without Markdown noise.
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Af-Soomaali Summary */}
          <div className="bg-slate-100 p-3 rounded-xl border border-slate-200">
            <h5 className="font-bold text-[11px] text-slate-900 mb-1">
              Af-Soomaali: Xeerarka Badbaadada
            </h5>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              Caawiyahaan uma shaqeeyo sidii dhaqtar shakhsi ah. Ma bixinayo cudur-sheegis (diagnosis), mana qorayo dawooyin ama xaddiga kaniiniyada (dosages). Ujeeddada kaliya waa waxbarasho iyo wacyigelin caafimaad. Wixii xaalad degdeg ah fadlan la xiriir isbitaal.
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold"
          >
            I Understand / Waan Fahmay
          </button>
        </div>
      </div>
    </div>
  );
};
