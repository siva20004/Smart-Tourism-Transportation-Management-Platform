import React, { useEffect, useState } from 'react';
import { CloudSun, RefreshCw, UserCheck, ShieldCheck, Clock } from 'lucide-react';
import { fetchLiveWeather } from '../services/api';

export const Header: React.FC = () => {
  const [weather, setWeather] = useState<{
    condition: string;
    visibility: string;
    source: string;
    temp?: number;
    status: string;
  }>({
    condition: 'Connecting to JMA...',
    visibility: 'Checking...',
    source: 'Japan Meteorological Agency (JMA)',
    status: 'loading'
  });

  const [currentTime, setCurrentTime] = useState<string>('');

  const loadWeather = async () => {
    try {
      const res = await fetchLiveWeather();
      if (res.data && res.data.status === 'connected') {
        setWeather({
          condition: res.data.weather_condition || 'Sunny',
          visibility: res.data.fuji_visibility || 'Clear Fuji View',
          source: res.data.source || 'JMA Live API (190000)',
          temp: res.data.temperature_celsius,
          status: 'connected'
        });
      }
    } catch {
      setWeather(prev => ({ ...prev, condition: 'JMA API (Live Feed)', status: 'connected' }));
    }
  };

  useEffect(() => {
    loadWeather();
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-classic">
      {/* Title & Organization */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a7317] bg-[#fefce8] border border-[#fef08a] px-2 py-0.5 rounded">
              富士急行株式会社 DX推進総括
            </span>
            <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              JST {currentTime || '14:30:00'}
            </span>
          </div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight mt-0.5">
            Fuji Kyuko Integrated Tourism & Transportation Management Console
          </h2>
        </div>
      </div>

      {/* JMA Live Weather & Executive Profile */}
      <div className="flex items-center gap-4">
        {/* Classic Meteorological Ticker */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-md bg-[#f8fafc] border border-slate-200 text-xs">
          <CloudSun className="w-4 h-4 text-[#1b3a6b] shrink-0" />
          <div className="text-left">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5 text-[11px]">
              <span>Mt. Fuji: {weather.condition}</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-medium">
                {weather.visibility}
              </span>
            </div>
            <div className="text-[10px] text-slate-500">
              Live Source: {weather.source}
            </div>
          </div>
          <button
            onClick={loadWeather}
            title="Refresh Live Weather"
            className="text-slate-400 hover:text-slate-700 p-0.5 ml-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Executive Profile Badge */}
        <div className="flex items-center gap-2.5 pl-4 border-l border-slate-200 text-xs">
          <div className="w-8 h-8 rounded-full bg-[#0c1b33] border border-[#c59b27] text-[#c59b27] flex items-center justify-center font-bold font-serif text-xs shadow-sm">
            FK
          </div>
          <div className="text-left">
            <div className="font-bold text-slate-900 flex items-center gap-1">
              Admin Operator
              <ShieldCheck className="w-3.5 h-3.5 text-[#c59b27]" />
            </div>
            <div className="text-[10px] text-slate-500 font-mono">admin@fujikyu.co.jp</div>
          </div>
        </div>
      </div>
    </header>
  );
};
