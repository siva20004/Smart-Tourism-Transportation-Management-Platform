import React from 'react';
import { Activity, Database, UploadCloud, Cpu, AlertTriangle, Calculator, FileCheck } from 'lucide-react';

interface Props {
  category: string;
  source?: string;
  compact?: boolean;
}

export const ProvenanceBadge: React.FC<Props> = ({ category, source, compact = false }) => {
  let badgeStyle = "bg-slate-50 text-slate-700 border-slate-300";
  let icon = <Database className="w-3 h-3 mr-1 text-slate-500" />;
  let label = category;

  const catLower = category.toLowerCase();

  if (catLower.includes("live")) {
    badgeStyle = "bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold";
    icon = <Activity className="w-3 h-3 mr-1 text-emerald-600 animate-pulse" />;
  } else if (catLower.includes("historical")) {
    badgeStyle = "bg-slate-50 text-slate-800 border-slate-300 font-medium";
    icon = <Database className="w-3 h-3 mr-1 text-[#1b3a6b]" />;
  } else if (catLower.includes("uploaded")) {
    badgeStyle = "bg-purple-50 text-purple-800 border-purple-300 font-medium";
    icon = <UploadCloud className="w-3 h-3 mr-1 text-purple-600" />;
  } else if (catLower.includes("ml") || catLower.includes("prediction")) {
    badgeStyle = "bg-amber-50 text-amber-900 border-amber-300 font-semibold";
    icon = <Cpu className="w-3 h-3 mr-1 text-amber-600" />;
  } else if (catLower.includes("derived")) {
    badgeStyle = "bg-sky-50 text-sky-900 border-sky-300 font-medium";
    icon = <Calculator className="w-3 h-3 mr-1 text-sky-600" />;
  } else if (catLower.includes("unavailable") || catLower.includes("not connected") || catLower.includes("awaiting")) {
    badgeStyle = "bg-rose-50 text-rose-800 border-rose-200 font-medium";
    icon = <AlertTriangle className="w-3 h-3 mr-1 text-rose-600" />;
  }

  if (compact) {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 text-[11px] rounded border ${badgeStyle}`}>
        {icon}
        {label}
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center">
        <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] rounded border ${badgeStyle}`}>
          {icon}
          {label}
        </span>
      </div>
      {source && (
        <span className="text-[10px] text-slate-500 truncate max-w-xs" title={source}>
          Source: {source}
        </span>
      )}
    </div>
  );
};
