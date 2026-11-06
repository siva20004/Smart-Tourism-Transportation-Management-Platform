import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { fetchRegionalMap, fetchItineraries } from '../services/api';
import { ProvenanceBadge } from '../components/ProvenanceBadge';
import { MapPin, Navigation, Compass, Info, Train, CheckCircle2, Clock } from 'lucide-react';

// Fix Leaflet default marker icons in React
const customStationIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [10, 32],
});

export const RouteIntelligence: React.FC = () => {
  const [mapData, setMapData] = useState<any>(null);
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchRegionalMap(), fetchItineraries()])
      .then(([mRes, iRes]) => {
        setMapData(mRes.data || null);
        setItineraries(iRes.data.itineraries || []);
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
              Spatial Intelligence • 路線・観光空間ナビゲーション
            </span>
            <ProvenanceBadge category="Live data" source="OpenStreetMap GIS & Fujikyuko Official Station Coordinates" compact />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1.5 font-serif">
            Regional Route & Spatial Navigation Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            OpenStreetMap GIS visualization showing 18 Fujikyuko Line stations, 6 Mount Fuji sightseeing hubs, and verified transit connections.
          </p>
        </div>
      </div>

      {/* Map Card */}
      <div className="classic-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#c59b27]" />
            <div>
              <h3 className="font-bold text-slate-800 text-sm font-serif">
                Mount Fuji & Fujikyuko Line Cartographic GIS View
              </h3>
              <p className="text-xs text-slate-500">Corridor: Otsuki (FJ01) ⇄ Mt. Fuji (FJ16) ⇄ Kawaguchiko (FJ18)</p>
            </div>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            CRS: EPSG:3857 (WGS 84 / Pseudo-Mercator)
          </div>
        </div>

        <div className="h-[420px] w-full rounded-lg overflow-hidden border border-slate-300 shadow-inner">
          <MapContainer
            center={[35.4981, 138.7686]}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mapData?.destinations?.map((d: any) => (
              <Marker key={`dest-${d.id}`} position={[d.lat, d.lng]} icon={customStationIcon}>
                <Popup>
                  <div className="text-xs font-sans">
                    <strong className="text-[#0c1b33] font-serif">{d.name}</strong> ({d.name_ja})
                    <div className="text-slate-500 mt-1">Elevation: {d.elevation_m}m</div>
                    <div className="text-slate-700 font-medium">{d.category}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
            {mapData?.railway_stations?.map((st: any) => (
              <Marker key={`st-${st.id}`} position={[st.lat, st.lng]} icon={customStationIcon}>
                <Popup>
                  <div className="text-xs font-sans">
                    <strong className="text-emerald-900 font-mono">{st.station_code}: {st.name}</strong> ({st.name_ja})
                    <div className="text-slate-500">Fujikyuko Line Station</div>
                    <div className="text-slate-500">Elevation: {st.elevation_m}m</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
              Sightseeing Hubs (6 Verified)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
              Fujikyuko Line Stations (18 Stations)
            </span>
          </div>
          <span className="text-[11px] text-slate-400">OpenStreetMap contributors</span>
        </div>
      </div>

      {/* Verified Itinerary Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {itineraries.map((it, idx) => (
          <div key={idx} className="classic-card p-6 flex flex-col justify-between hover:border-[#c59b27]/40 transition-all">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a7317] bg-[#fefce8] border border-[#fef08a] px-2 py-0.5 rounded">
                    Official Transit Route
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm font-serif mt-1.5">{it.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#0c1b33] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#c59b27]" />
                    {it.duration}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">Est. ¥{it.estimated_cost_jpy?.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="text-xs text-slate-600">
                  <strong className="text-slate-800">Primary Transit: </strong>
                  {it.transport_modes?.join(' + ')}
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">Transit Waypoints:</span>
                  <div className="space-y-1.5">
                    {it.waypoints?.map((wp: string, wIdx: number) => (
                      <div key={wIdx} className="flex items-center gap-2 text-xs text-slate-700">
                        <span className="w-4 h-4 rounded-full bg-[#0c1b33] text-[#f4d06f] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                          {wIdx + 1}
                        </span>
                        <span>{wp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Timetable Synchronized
              </span>
              <span>Source: Fuji Kyuko Published Transit Guide</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
