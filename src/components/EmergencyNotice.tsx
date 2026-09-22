import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, PhoneCall, ShieldAlert } from 'lucide-react';
import { LanguageMode } from '../types';

interface EmergencyNoticeProps {
  languageMode: LanguageMode;
}

export const EmergencyNotice: React.FC<EmergencyNoticeProps> = ({ languageMode }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div
      id="emergency-safety-banner"
      className="bg-amber-50 border-b border-amber-200 text-amber-950 px-3 py-2 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1">
          <div className="p-1 bg-amber-500/15 rounded-md text-amber-700 shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-amber-900 tracking-wide uppercase">
                {languageMode === 'so'
                  ? 'Ogeysiis Degdeg ah ee Badbaadada'
                  : languageMode === 'en'
                  ? 'Emergency Safety Notice'
                  : 'Emergency Notice / Ogeysiis Degdeg ah'}
              </h4>
              <span className="inline-flex items-center px-1.5 py-0.2 text-[9px] font-semibold bg-rose-100 text-rose-800 rounded border border-rose-300">
                Urgent
              </span>
            </div>

            <p className="text-[11px] text-amber-900/90 leading-snug mt-0.5">
              {languageMode === 'so' ? (
                'Bot-kani waa waxbarasho caafimaad oo keliya. Haddii adiga ama qof kale uu la kulmo xaalad degdeg ah, fadlan tag isbitaalka kuugu dhow ama wac adeegga gurmadka degdegga ah.'
              ) : languageMode === 'en' ? (
                'This assistant provides general health education only. If you or someone nearby is experiencing a medical emergency, go to the nearest emergency room or call local emergency services immediately.'
              ) : (
                'General health education only. For acute emergencies, seek immediate hospital care. / Waa waxbarasho caafimaad oo keliya. Xaaladaha degdegga ah, la xiriir isbitaal degdeg ah.'
              )}
            </p>
          </div>
        </div>

        <button
          id="btn-toggle-emergency-details"
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-amber-800 hover:bg-amber-200/50 rounded transition-colors self-start shrink-0"
          title={isExpanded ? 'Collapse' : 'Show Emergency Red Flags'}
          aria-expanded={isExpanded}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div id="emergency-red-flags-panel" className="mt-2.5 pt-2 border-t border-amber-200/70 text-[11px] space-y-2">
          <div className="bg-white/80 p-2 rounded-md border border-amber-200">
            <div className="font-semibold text-rose-900 flex items-center gap-1 mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>
                {languageMode === 'so'
                  ? 'Calaamadaha Halista ah (Daryeel Degdeg ah u baahan):'
                  : 'Critical Red Flag Symptoms (Seek Emergency Care):'}
              </span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-800 pl-1 text-[11px]">
              {languageMode !== 'so' && (
                <>
                  <li>Severe crushing chest pain, pressure, or tightness</li>
                  <li>Sudden severe difficulty breathing or gasping for air</li>
                  <li>Sudden weakness, facial droop, or speech difficulty (Stroke)</li>
                  <li>Uncontrolled or heavy profuse bleeding</li>
                  <li>Loss of consciousness, seizures, or sudden confusion</li>
                </>
              )}
              {languageMode === 'both' && <li className="list-none my-1 border-t border-slate-200" />}
              {languageMode !== 'en' && (
                <>
                  <li>Xanuun daran ama culeys xagga laabta iyo wadnaha ah</li>
                  <li>Neefta oo si daran qofka ugu dhagta ama neef-qaadashada oo adkaata</li>
                  <li>Daciifnimo degdeg ah, wejiga oo qaloocsama, ama hadalka oo dhib noqda (Faalig)</li>
                  <li>Dhiig-bax xooggan oo aan joogsanayn</li>
                  <li>Miyir-beel, suuxdin, ama jahawareer maskaxeed oo degdeg ah</li>
                </>
              )}
            </ul>
          </div>

          <div className="flex items-center justify-between text-[10px] text-amber-900/80 px-1 font-medium">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-rose-700" />
              <span>Dial 911 / 999 / 112 or local regional emergency responder</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
