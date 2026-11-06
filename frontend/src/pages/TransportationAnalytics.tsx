import React, { useEffect, useState } from 'react';
import { fetchStations, fetchRoutes, fetchSchedules, fetchPassengerAnalytics } from '../services/api';
import { ProvenanceBadge } from '../components/ProvenanceBadge';
import type { RailwayStation } from '../types';
import { Train, Bus, Clock, AlertCircle } from 'lucide-react';

export const TransportationAnalytics: React.FC = () => {
  const [stations, setStations] = useState<RailwayStation[]>([]);
  const [routes, setRoutes] = useState<any>({ railway: [], bus: [] });
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchStations(), fetchRoutes(), fetchSchedules(), fetchPassengerAnalytics()])
      .then(([sRes, rRes, schRes]) => {
        setStations(sRes.data || []);
        setRoutes(rRes.data || { railway: [], bus: [] });
        setSchedules(schRes.data.records || []);
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
              Rail & Bus Corridor Operations
            </span>
            <ProvenanceBadge category="Historical data" source="Fuji Sanroku Electric Railway & Fujikyu Bus" compact />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1.5 font-serif">
            Transportation Corridors & Official Timetable Explorer
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Fujikyuko Line (Otsuki to Kawaguchiko, 18 stations) and sightseeing bus network.
          </p>
        </div>
      </div>

      {/* Real data disclaimer card */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 leading-relaxed">
          <strong className="font-semibold">Enterprise Operational Principle:</strong> Published timetables represent scheduled train and bus departures. Timetables are strictly decoupled from passenger occupancy and live vehicle GPS feeds. No simulated vehicle tracking is generated.
        </div>
      </div>

      {/* Timetable Explorer */}
      <div className="classic-card p-6">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-serif">Official Published Timetable</h3>
            <p className="text-xs text-slate-500">Express trains, limited express & sightseeing connector buses</p>
          </div>
          <ProvenanceBadge category="Historical data" source="Fuji Kyuko Official Disclosures" compact />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Service Type</th>
                <th className="py-2.5 px-3">Trip Identifier</th>
                <th className="py-2.5 px-3">Station / Stop</th>
                <th className="py-2.5 px-3">Departure</th>
                <th className="py-2.5 px-3">Arrival</th>
                <th className="py-2.5 px-3">Attribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedules.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-semibold text-blue-700">{s.service_type}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">{s.trip_identifier}</td>
                  <td className="py-2.5 px-3 text-slate-700">{s.station_or_stop}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{s.departure_time}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{s.arrival_time || '—'}</td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">{s.source_attribution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fujikyuko Line 18 Stations Explorer */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Fujikyuko Line Stations (18 Stations)</h3>
            <p className="text-xs text-slate-500">From Otsuki (FJ01, 358m) to Kawaguchiko (FJ18, 857m)</p>
          </div>
          <ProvenanceBadge category="Historical data" source="Fuji Sanroku Electric Railway Profile" compact />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stations.map((st) => (
            <div key={st.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center hover:bg-blue-50 transition-colors">
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                {st.station_code}
              </span>
              <div className="font-bold text-slate-800 text-xs mt-1.5">{st.name}</div>
              <div className="text-[10px] text-slate-400">{st.name_ja}</div>
              <div className="text-[10px] text-slate-500 mt-1">Elev: {st.elevation_m}m</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
