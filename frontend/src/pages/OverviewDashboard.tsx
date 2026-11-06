import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Users,
  Train,
  Hotel,
  CalendarCheck,
  CreditCard,
  RefreshCw,
  ExternalLink,
  Download,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { fetchDashboardKPIs, fetchDashboardCharts, getDatasetDownloadUrl } from '../services/api';
import { ProvenanceBadge } from '../components/ProvenanceBadge';
import type { KPIItem } from '../types';

export const OverviewDashboard: React.FC = () => {
  const [range, setRange] = useState<string>('30d');
  const [kpis, setKpis] = useState<KPIItem[]>([]);
  const [charts, setCharts] = useState<any>({
    tourist_trend: [],
    passenger_trend: [],
    destination_distribution: [],
    hotel_trend: []
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [dateRangeStr, setDateRangeStr] = useState<string>('');

  const loadData = async (selectedRange: string) => {
    setLoading(true);
    try {
      const [kpiRes, chartRes] = await Promise.all([
        fetchDashboardKPIs(selectedRange),
        fetchDashboardCharts(selectedRange)
      ]);
      setKpis(kpiRes.data.kpis || []);
      setDateRangeStr(kpiRes.data.date_range || '');
      setCharts(chartRes.data || {});
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(range);
  }, [range]);

  const CLASSIC_COLORS = ['#1b3a6b', '#047857', '#c59b27', '#6b21a8', '#b91c1c', '#0369a1'];

  return (
    <div className="space-y-6">
      {/* Executive Control Header */}
      <div className="classic-card classic-card-gold-top p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a7317] bg-[#fefce8] border border-[#fef08a] px-2 py-0.5 rounded">
              取締役会・経営企画統括ビュー
            </span>
            <ProvenanceBadge category="Derived analytics" source="PostgreSQL Production Persistence" compact />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1.5 font-serif">
            Executive Operations & Regional Demand Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active reporting interval: <span className="font-semibold text-slate-700">{dateRangeStr || 'Last 30 Days'}</span> (Verified database aggregations)
          </p>
        </div>

        {/* Date Filter Buttons & Dataset Export Shortcut */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-md shadow-sm border border-slate-200 bg-white p-0.5">
            {[
              { id: 'today', label: '本日' },
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '90d', label: '90 Days' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setRange(btn.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-all ${
                  range === btn.id
                    ? 'bg-[#0c1b33] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <a
            href={getDatasetDownloadUrl('tourism')}
            download
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold border border-slate-300 flex items-center gap-1.5 transition-colors shadow-sm"
            title="Download underlying official tourism records as CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#1b3a6b]" />
            Export Data (.CSV)
          </a>

          <button
            onClick={() => loadData(range)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded border border-slate-200 bg-white"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.key}
            className="classic-card p-5 hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 tracking-tight">
                    {kpi.label}
                  </span>
                  <div className="text-[11px] text-slate-400">{kpi.label_ja}</div>
                </div>
                <ProvenanceBadge category={kpi.data_status} compact />
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight font-serif">
                  {kpi.unit === '¥ JPY'
                    ? `¥${kpi.value.toLocaleString()}`
                    : kpi.value.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-slate-500 font-sans">{kpi.unit}</span>
                {kpi.change_pct > 0 && (
                  <span className="ml-auto text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />
                    +{kpi.change_pct}%
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Traceable Source:</span>
                <span className="font-medium text-slate-700 truncate max-w-[190px]" title={kpi.source}>
                  {kpi.source}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Data Coverage:</span>
                <span className="text-slate-600 truncate max-w-[190px]">{kpi.data_coverage}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Audited Timestamp:</span>
                <span className="font-mono">{kpi.last_updated}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row 1: Tourism Trend & Passenger Corridor Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tourism Trend */}
        <div className="classic-card p-6">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-serif">
                Mount Fuji Tourist Visits Trend Over Time
              </h3>
              <p className="text-xs text-slate-500">
                Daily recorded tourist volume (Domestic vs International Inbound)
              </p>
            </div>
            <ProvenanceBadge category="Historical data" source="Yamanashi Tourism Survey" compact />
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.tourist_trend}>
                <defs>
                  <linearGradient id="domesticGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1b3a6b" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#1b3a6b" stopOpacity={0.03} />
                  </linearGradient>
                  <linearGradient id="intlGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#047857" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#047857" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toLocaleString()} visitors`, '']}
                  labelFormatter={(lbl) => `Date: ${lbl}`}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="domestic" name="Domestic Visitors" stroke="#1b3a6b" strokeWidth={2} fillOpacity={1} fill="url(#domesticGrad)" />
                <Area type="monotone" dataKey="international" name="International Inbound" stroke="#047857" strokeWidth={2} fillOpacity={1} fill="url(#intlGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Passenger Demand */}
        <div className="classic-card p-6">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-serif">
                Fujikyuko Line Daily Passenger Demand
              </h3>
              <p className="text-xs text-slate-500">
                Otsuki — Kawaguchiko rail corridor ridership
              </p>
            </div>
            <ProvenanceBadge category="Historical data" source="Fuji Sanroku Electric Railway" compact />
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.passenger_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: any) => [`${Number(val).toLocaleString()} passengers`, 'Ridership']} />
                <Bar dataKey="passengers" name="Railway Passengers" fill="#1b3a6b" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Charts Row 2: Destination Distribution & Hotel Occupancy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Destination Distribution */}
        <div className="classic-card p-6">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-serif">
                Visitor Distribution by Mount Fuji Destination
              </h3>
              <p className="text-xs text-slate-500">
                Share of recorded visitors across key regional attractions
              </p>
            </div>
            <ProvenanceBadge category="Derived analytics" source="PostgreSQL Aggregation" compact />
          </div>

          <div className="h-64 flex items-center justify-center">
            {charts.destination_distribution && charts.destination_distribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.destination_distribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.name} (${entry.value}%)`}
                  >
                    {charts.destination_distribution.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={CLASSIC_COLORS[index % CLASSIC_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`${val}% share`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                No destination breakdown records in selected range.
              </div>
            )}
          </div>
        </div>

        {/* Hotel Occupancy Trends */}
        <div className="classic-card p-6">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-serif">
                Hotel Room Occupancy Trend (%)
              </h3>
              <p className="text-xs text-slate-500">
                (Occupied Rooms / Available Rooms) × 100
              </p>
            </div>
            <ProvenanceBadge category="Uploaded data" source="Fuji Kyuko Hotel PMS Import" compact />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.hotel_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} unit="%" />
                <Tooltip formatter={(val: any) => [`${val}%`, 'Occupancy Rate']} />
                <Line
                  type="monotone"
                  dataKey="occupancy_rate"
                  name="Occupancy Rate"
                  stroke="#c59b27"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#c59b27' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
