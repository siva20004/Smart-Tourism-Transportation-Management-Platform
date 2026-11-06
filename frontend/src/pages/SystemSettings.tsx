import React from 'react';
import { Settings, ShieldCheck, Database, Key, Server, Cpu, CheckCircle2 } from 'lucide-react';
import { ProvenanceBadge } from '../components/ProvenanceBadge';

export const SystemSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="classic-card classic-card-gold-top p-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a7317] bg-[#fefce8] border border-[#fef08a] px-2 py-0.5 rounded">
              System Configuration • システム環境設定
            </span>
            <ProvenanceBadge category="Derived analytics" source="Localhost Environment Settings" compact />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1.5 font-serif">
            System Settings & Security Parameters
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Fuji Kyuko DX operational environment parameters, PostgreSQL connection pools, and API keys.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Database Configuration */}
        <div className="classic-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-[#c59b27]" />
            <h3 className="font-bold text-slate-900 text-sm font-serif">PostgreSQL Database Connection</h3>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Host & Port</span>
              <span className="font-mono text-slate-900 font-bold">localhost:5432</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Database Name</span>
              <span className="font-mono text-slate-900 font-bold">fuji_smart_dx</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500">ORM & Driver</span>
              <span className="font-mono text-slate-700">SQLAlchemy 2.1 + Psycopg 3.3 (Active)</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-900 text-[11px] font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Database is operational and holding authentic reference records.
            </div>
          </div>
        </div>

        {/* Security & Authentication */}
        <div className="classic-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm font-serif">Authentication & RBAC</h3>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500">JWT Algorithm</span>
              <span className="font-mono text-slate-900 font-bold">HS256 (24-Hour Expiration)</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Password Hashing</span>
              <span className="font-mono text-slate-700">Bcrypt Salted Encryption</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Active Operator Account</span>
              <span className="font-mono text-[#0c1b33] font-bold">admin@fujikyu.co.jp (Role: Admin)</span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-900 text-[11px] font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              Role-Based Access Control enforced on data upload and model re-training.
            </div>
          </div>
        </div>

        {/* External API Keys */}
        <div className="classic-card p-6 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-[#c59b27]" />
            <h3 className="font-bold text-slate-900 text-sm font-serif">External API Key Credentials (.env)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-slate-900 block font-serif">Japan Meteorological Agency (JMA)</span>
              <span className="text-[11px] text-emerald-700 font-semibold block mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Live JSON (No Key Required)
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Live 6-hour forecast feed (Area 190000)</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-slate-900 block font-serif">Japan e-Stat Government API</span>
              <span className="text-[11px] text-slate-700 font-mono block mt-1.5">Configured via .env ESTAT_APP_ID</span>
              <span className="text-[11px] text-slate-500 mt-1 block">Obtain at e-stat.go.jp for microdata</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-slate-900 block font-serif">OpenStreetMap & OSRM</span>
              <span className="text-[11px] text-emerald-700 font-semibold block mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Connected (Open GIS Data)
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">WGS84 Coordinates & Cartography</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
