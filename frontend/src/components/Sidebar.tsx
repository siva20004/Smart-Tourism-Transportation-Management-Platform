import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Palmtree,
  Train,
  TrendingUp,
  Hotel,
  CalendarCheck,
  Bot,
  MapPin,
  Database,
  Upload,
  Cpu,
  FileText,
  Settings,
  ShieldCheck,
  Award
} from 'lucide-react';
import { FujiLogo } from './FujiLogo';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Overview Dashboard', label_ja: '総合経営ダッシュボード', icon: LayoutDashboard },
    { to: '/tourism', label: 'Tourism Analytics', label_ja: '観光動向・需要分析', icon: Palmtree },
    { to: '/transportation', label: 'Transportation Analytics', label_ja: '鉄道・バス運行分析', icon: Train },
    { to: '/forecasting', label: 'Demand Forecasting', label_ja: 'AI観光需要予測', icon: TrendingUp },
    { to: '/hotels', label: 'Hotel Analytics', label_ja: 'ホテル客室稼働分析', icon: Hotel },
    { to: '/bookings', label: 'Booking Management', label_ja: '予約台帳・売上管理', icon: CalendarCheck },
    { to: '/assistant', label: 'AI Tourism Assistant', label_ja: '多言語観光AI案内', icon: Bot },
    { to: '/routes', label: 'Route Intelligence', label_ja: '周遊空間ルート探索', icon: MapPin },
    { to: '/data-sources', label: 'Data Sources', label_ja: 'データ連携基盤管理', icon: Database },
    { to: '/upload', label: 'Data Upload & Download', label_ja: 'データ取込・出力・検証', icon: Upload },
    { to: '/ml-management', label: 'ML Model Management', label_ja: '機械学習モデル管理', icon: Cpu },
    { to: '/reports', label: 'Reports', label_ja: '業務レポート出力', icon: FileText },
    { to: '/settings', label: 'System Settings', label_ja: 'システム環境設定', icon: Settings },
  ];

  return (
    <aside className="w-72 bg-[#0c1b33] text-slate-200 flex flex-col h-screen sticky top-0 border-r border-[#1a2d4f] shadow-2xl select-none z-30">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#1b3158] bg-[#081325]">
        <div className="flex items-center gap-3">
          <FujiLogo size={44} />
          <div>
            <div className="text-[10px] tracking-widest text-[#c59b27] font-bold uppercase">
              Official Platform
            </div>
            <h1 className="font-bold text-base tracking-wider text-white">
              FUJI SMART DX
            </h1>
            <p className="text-[11px] text-slate-300 font-medium">
              富士急行株式会社 DX推進基盤
            </p>
          </div>
        </div>
      </div>

      {/* Sub-header status bar */}
      <div className="px-4 py-2 bg-[#0a182e] border-b border-[#162744] flex items-center justify-between text-[10px]">
        <span className="flex items-center gap-1.5 text-slate-300 font-medium">
          <Award className="w-3.5 h-3.5 text-[#c59b27]" />
          Enterprise Certified
        </span>
        <span className="font-mono text-[#94a3b8]">PostgreSQL 18</span>
      </div>

      {/* Navigation list */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-xs transition-all relative group ${
                  isActive
                    ? 'bg-[#172c4e] text-white font-semibold border-l-2 border-[#c59b27] shadow-sm'
                    : 'text-slate-300 hover:bg-[#13233f] hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-[#c59b27] transition-colors" />
              <div className="flex-1 min-w-0">
                <div className="truncate text-[12px]">{item.label}</div>
                <div className="text-[10px] text-slate-400 font-normal truncate">{item.label_ja}</div>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {String(idx + 1).padStart(2, '0')}
              </span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer corporate profile */}
      <div className="p-3.5 border-t border-[#1b3158] bg-[#081325] text-[11px]">
        <div className="flex items-center justify-between text-slate-300">
          <span className="font-semibold text-white">Fuji Kyuko Co., Ltd.</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded font-mono">
            LIVE SYNC
          </span>
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          Transport, Tourism & Resort Operations
        </div>
      </div>
    </aside>
  );
};
