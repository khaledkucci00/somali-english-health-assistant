import React, { ReactNode, useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface MobileFrameProps {
  children: ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(true);

  return (
    <div
      id="app-root-container"
      className="min-h-screen bg-slate-900/90 py-0 sm:py-6 px-0 sm:px-4 flex flex-col items-center justify-center transition-colors duration-200"
    >
      {/* Desktop Frame Switcher Control */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md mb-2.5 px-2 text-xs text-slate-300">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-200 font-semibold">Somali English Health Assistant</span>
        </div>
        <button
          id="btn-toggle-frame-mode"
          type="button"
          onClick={() => setIsDeviceFrame(!isDeviceFrame)}
          className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-slate-700 transition-colors"
        >
          {isDeviceFrame ? (
            <>
              <Monitor className="w-3.5 h-3.5" />
              <span>Full Screen View</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Phone Frame</span>
            </>
          )}
        </button>
      </div>

      {/* Frame Container */}
      <div
        id="mobile-phone-chassis"
        className={`w-full transition-all duration-300 flex flex-col bg-slate-50 overflow-hidden ${
          isDeviceFrame
            ? 'max-w-md h-[92vh] max-h-[890px] rounded-3xl sm:border-[8px] sm:border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] ring-1 ring-slate-700'
            : 'max-w-3xl h-[95vh] rounded-2xl shadow-xl border border-slate-700'
        }`}
      >
        {/* Dynamic Island / Speaker notch */}
        {isDeviceFrame && (
          <div className="hidden sm:flex justify-center pt-2 pb-0.5 bg-slate-50 select-none">
            <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center gap-2 px-2">
              <div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800" />
            </div>
          </div>
        )}

        {/* Inner Phone Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* Mobile Home Bar indicator */}
        <div className="h-4 bg-slate-50 flex items-center justify-center shrink-0 select-none">
          <div className="w-32 h-1 bg-slate-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};
