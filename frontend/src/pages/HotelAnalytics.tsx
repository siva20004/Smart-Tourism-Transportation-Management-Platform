import React, { useEffect, useState } from 'react';
import { fetchHotelProperties, fetchHotelOccupancy } from '../services/api';
import { ProvenanceBadge } from '../components/ProvenanceBadge';
import { Hotel, Bed, CheckCircle2, Download, Building2, TrendingUp, ShieldCheck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const HotelAnalytics: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [occupancyTrend, setOccupancyTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchHotelProperties(), fetchHotelOccupancy()])
      .then(([pRes, oRes]) => {
        setProperties(pRes.data || []);
        setOccupancyTrend(oRes.data.trend || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="classic-card classic-card-gold-top p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a7317] bg-[#fefce8] border border-[#fef08a] px-2 py-0.5 rounded">
              Hospitality Operations • 富士急ホテルグループ
            </span>
            <ProvenanceBadge category="Uploaded data" source="Fuji Kyuko Property Management System (PMS)" compact />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1.5 font-serif">
            Fuji Kyuko Hotel Group Occupancy & Inventory Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified room inventory, occupied keys, and official daily occupancy computations across Mount Fuji properties.
          </p>
        </div>

        {/* Dataset Download Action */}
        <div className="flex items-center gap-2">
          <a
            href="/api/v1/upload/download/hotel"
            download="fuji_kyuko_hotel_occupancy.csv"
            className="px-3.5 py-2 bg-[#0c1b33] hover:bg-[#142646] text-[#f4d06f] border border-[#c59b27]/40 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#c59b27]" />
            <span>Export Hotel Dataset (.CSV)</span>
          </a>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {properties.map((p) => (
          <div key={p.id} className="classic-card p-5 flex flex-col justify-between hover:border-[#c59b27]/50 transition-all">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-serif">{p.name}</h3>
                  <div className="text-[11px] text-[#9a7317] font-serif font-medium">{p.name_ja}</div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0c1b33]">
                  <Building2 className="w-4 h-4 text-[#c59b27]" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-serif font-bold text-[#0c1b33]">
                  {p.occupancy_rate_pct !== null ? `${p.occupancy_rate_pct}%` : 'N/A'}
                </span>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Occupancy Rate</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
              <div className="flex justify-between">
                <span>Total Room Inventory:</span>
                <span className="font-semibold text-slate-800">{p.total_rooms} units</span>
              </div>
              <div className="flex justify-between">
                <span>Occupied / Available:</span>
                <span className="font-semibold text-slate-800">
                  {p.occupied_rooms || 0} / {p.available_rooms} units
                </span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="text-slate-700 truncate max-w-[140px] font-medium">{p.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Occupancy Trend Chart */}
      <div className="classic-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#c59b27]" />
              <h3 className="font-bold text-slate-800 text-sm font-serif">
                Historical Property Occupancy Rate Trend
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict mathematical derivation: <code className="text-[#0c1b33] bg-slate-100 px-1 py-0.5 rounded font-mono">(Occupied Units ÷ Available Units) × 100</code>
            </p>
          </div>
          <ProvenanceBadge category="Derived analytics" source="PostgreSQL Calculation from Verified Ledger" compact />
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={occupancyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
              <YAxis domain={[50, 100]} unit="%" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0c1b33',
                  borderRadius: '8px',
                  border: '1px solid rgba(197, 155, 39, 0.4)',
                  color: '#ffffff',
                  fontSize: '12px'
                }}
                formatter={(val: any) => [`${val}%`, 'Occupancy Rate']}
              />
              <Line
                type="monotone"
                dataKey="occupancy_rate"
                stroke="#c59b27"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#0c1b33', stroke: '#c59b27', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#f4d06f' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Verified against daily property night audit closings
          </div>
          <div className="text-[11px] text-slate-400">
            Source: Fuji Kyuko Co., Ltd. Hospitality Operations Division
          </div>
        </div>
      </div>
    </div>
  );
};
