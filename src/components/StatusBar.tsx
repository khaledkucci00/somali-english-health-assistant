import React, { useState, useEffect } from 'react';
import { Wifi, Signal, BatteryCharging } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const [timeStr, setTimeStr] = useState<string>('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="mobile-status-bar"
      className="flex items-center justify-between px-5 pt-2.5 pb-1 select-none text-slate-800 text-xs font-semibold tracking-tight"
    >
      <div className="flex items-center space-x-1">
        <span className="text-[13px] font-bold text-slate-900">{timeStr}</span>
      </div>

      <div className="flex items-center space-x-2 text-slate-700">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center space-x-0.5">
          <span className="text-[10px] font-medium text-slate-600">98%</span>
          <BatteryCharging className="w-4 h-4 text-emerald-600" />
        </div>
      </div>
    </div>
  );
};
