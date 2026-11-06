import React, { useEffect, useState } from 'react';
import { fetchDestinations, fetchSeasonality } from '../services/api';
import { ProvenanceBadge } from '../components/ProvenanceBadge';
import type { Destination } from '../types';
import { ExternalLink, MapPin } from 'lucide-react';

export const TourismAnalytics: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [seasonality, setSeasonality] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDestinations(), fetchSeasonality()])
      .then(([dRes, sRes]) => {
        setDestinations(dRes.data || []);
        setSeasonality(sRes.data || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="classic-card classic-card-gold-top p-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a7317] bg-[#fefce8] border border-[#fef08a] px-2 py-0.5 rounded">
              Regional Tourism Intelligence
            </span>
            <ProvenanceBadge category="Historical data" source="Yamanashi Tourism Survey & JNTO" compact />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1.5 font-serif">
            Mount Fuji & Fuji Five Lakes Regional Tourism Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Visitor statistics, seasonal multipliers, and international inbound origins.
          </p>
        </div>
      </div>

      {/* Seasonality Summary Card */}
      {seasonality && (
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-sky-300 font-semibold">
              Seasonality & Demand Multipliers
            </span>
            <ProvenanceBadge category={seasonality.data_status} compact />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
              <span className="text-xs text-sky-200">Weekend Surge Multiplier</span>
              <div className="text-2xl font-black mt-1">{seasonality.weekend_surge_multiplier}x</div>
              <div className="text-[11px] text-slate-300">Surge over weekday base</div>
            </div>
            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
              <span className="text-xs text-sky-200">Peak Demand Months</span>
              <div className="text-sm font-semibold mt-1">July — August & Autumn</div>
              <div className="text-[11px] text-slate-300">Climbing Season & Foliage</div>
            </div>
            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
              <span className="text-xs text-sky-200">Top International Markets</span>
              <div className="text-sm font-semibold mt-1">Taiwan, US, S. Korea, India</div>
              <div className="text-[11px] text-slate-300">JNTO Origin Survey</div>
            </div>
          </div>
        </div>
      )}

      {/* Destination Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {destinations.map((d) => (
          <div key={d.id} className="classic-card p-5 flex flex-col justify-between hover:border-slate-300">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-serif tracking-tight">{d.name}</h3>
                  <div className="text-[11px] text-slate-400">{d.name_ja}</div>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold border border-slate-200">
                  {d.category}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">{d.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Elevation:</span>
                <span className="font-semibold text-slate-700">{d.elevation_m}m</span>
              </div>
              <div className="flex justify-between">
                <span>Total Recorded Visitors:</span>
                <span className="font-semibold text-slate-700">
                  {d.total_recorded_visitors ? d.total_recorded_visitors.toLocaleString() : 'N/A'}
                </span>
              </div>
              {d.official_website && (
                <a
                  href={d.official_website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline pt-1 text-xs"
                >
                  Official Portal <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
