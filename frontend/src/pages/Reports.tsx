import React, { useEffect, useState } from 'react';
import { fetchReports, generateReport } from '../services/api';
import { ProvenanceBadge } from '../components/ProvenanceBadge';
import { FileText, Download, Plus, CheckCircle2, Table, Database } from 'lucide-react';

export const Reports: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<string>('Monthly Tourism Analytics');
  const [generating, setGenerating] = useState<boolean>(false);

  const loadReports = () => {
    fetchReports().then((res) => setReports(res.data || [])).catch(console.error);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generateReport(selectedType);
      loadReports();
    } catch (e) {
      alert("Report generation failed");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="classic-card classic-card-gold-top p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a7317] bg-[#fefce8] border border-[#fef08a] px-2 py-0.5 rounded">
              Business Intelligence • 役員向け報告書・データ出力
            </span>
            <ProvenanceBadge category="Derived analytics" source="PostgreSQL Official Ledger Records" compact />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1.5 font-serif">
            Executive Business Reports & Official Data Exports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Compile executive operations reports and export complete verified datasets for corporate governance.
          </p>
        </div>

        {/* Generate selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-700 focus:outline-none focus:border-[#c59b27]"
          >
            <option value="Daily Tourism Report">Daily Tourism Report</option>
            <option value="Weekly Transportation Report">Weekly Transportation Report</option>
            <option value="Monthly Tourism Analytics">Monthly Tourism Analytics</option>
            <option value="Hotel Occupancy Report">Hotel Occupancy Report</option>
            <option value="Data Quality Report">Data Quality Report</option>
          </select>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-4 py-2 bg-[#0c1b33] hover:bg-[#142646] text-[#f4d06f] border border-[#c59b27]/40 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
          >
            <Plus className="w-4 h-4 text-[#c59b27]" />
            {generating ? 'Compiling...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Direct Dataset Exports Section */}
      <div className="classic-card p-6">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-[#c59b27]" />
          <h3 className="font-bold text-slate-900 text-sm font-serif">
            Direct Dataset Export Center (PostgreSQL Direct Stream)
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Export verified database tables directly to standard CSV format for external audits and reporting.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <a
            href="/api/v1/upload/download/tourism"
            download="yamanashi_official_tourism_statistics.csv"
            className="p-3.5 bg-slate-50 hover:bg-[#0c1b33] text-slate-700 hover:text-white border border-slate-200 hover:border-[#c59b27] rounded-lg transition-all group flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-xs group-hover:text-[#f4d06f]">Official Tourism Data</div>
              <div className="text-[11px] text-slate-400 group-hover:text-slate-300">1,460 Records (2021-2024)</div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-[#c59b27]" />
          </a>

          <a
            href="/api/v1/upload/download/hotel"
            download="fuji_kyuko_hotel_occupancy.csv"
            className="p-3.5 bg-slate-50 hover:bg-[#0c1b33] text-slate-700 hover:text-white border border-slate-200 hover:border-[#c59b27] rounded-lg transition-all group flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-xs group-hover:text-[#f4d06f]">Hotel Occupancy Data</div>
              <div className="text-[11px] text-slate-400 group-hover:text-slate-300">Daily Units & PMS Audits</div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-[#c59b27]" />
          </a>

          <a
            href="/api/v1/upload/download/booking"
            download="fuji_kyuko_bookings.csv"
            className="p-3.5 bg-slate-50 hover:bg-[#0c1b33] text-slate-700 hover:text-white border border-slate-200 hover:border-[#c59b27] rounded-lg transition-all group flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-xs group-hover:text-[#f4d06f]">Corporate Bookings</div>
              <div className="text-[11px] text-slate-400 group-hover:text-slate-300">Validated Reservation Ledger</div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-[#c59b27]" />
          </a>

          <a
            href="/api/v1/upload/download/passenger"
            download="fuji_kyuko_passenger_statistics.csv"
            className="p-3.5 bg-slate-50 hover:bg-[#0c1b33] text-slate-700 hover:text-white border border-slate-200 hover:border-[#c59b27] rounded-lg transition-all group flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-xs group-hover:text-[#f4d06f]">Passenger Flow</div>
              <div className="text-[11px] text-slate-400 group-hover:text-slate-300">Corridor Statistics</div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-[#c59b27]" />
          </a>
        </div>
      </div>

      {/* Generated Reports Table */}
      <div className="classic-card p-6">
        <h3 className="font-bold text-slate-800 text-sm font-serif mb-4">Generated Business Intelligence Reports</h3>

        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#c59b27]/50 transition-all">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm font-serif">{r.title}</span>
                  <span className="text-[10px] bg-[#0c1b33] text-[#f4d06f] px-2 py-0.5 rounded font-mono font-bold">
                    {r.type}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Period: <span className="font-mono text-slate-700 font-medium">{r.period}</span> • Traceable Sources: {r.data_sources?.join(', ')}
                </div>

                {r.summary_metrics && (
                  <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs text-slate-600">
                    {Object.entries(r.summary_metrics).map(([k, v]: any) => (
                      <span key={k} className="bg-white px-2.5 py-1 rounded border border-slate-200 font-mono text-[11px]">
                        <span className="text-slate-400 uppercase">{k.replace(/_/g, ' ')}:</span> <strong className="text-slate-900">{String(v)}</strong>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-slate-400 font-mono">
                  {r.generated_at ? r.generated_at.split('T')[0] : 'N/A'}
                </span>
                <a
                  href={`/api/v1/reports/${r.id}/download`}
                  download={`${r.title.toLowerCase().replace(/\s+/g, '_')}.json`}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  JSON
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
