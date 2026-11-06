import React, { useEffect, useState } from 'react';
import { fetchDataSources, testDataSource, getDatasetDownloadUrl } from '../services/api';
import { ProvenanceBadge } from '../components/ProvenanceBadge';
import type { DataSourceItem } from '../types';
import { Database, CheckCircle2, AlertCircle, RefreshCw, Zap, Download, ExternalLink } from 'lucide-react';

export const DataSources: React.FC = () => {
  const [sources, setSources] = useState<DataSourceItem[]>([]);
  const [testingId, setTestingId] = useState<number | null>(null);
  const [testResult, setTestResult] = useState<{ id: number; message: string; success: boolean } | null>(null);

  const loadSources = () => {
    fetchDataSources().then((res) => setSources(res.data || [])).catch(console.error);
  };

  useEffect(() => {
    loadSources();
  }, []);

  const handleTest = async (id: number) => {
    setTestingId(id);
    setTestResult(null);
    try {
      const res = await testDataSource(id);
      setTestResult({ id, message: res.data.message, success: res.data.success });
      loadSources();
    } catch (e: any) {
      setTestResult({ id, message: "Connection test failed", success: false });
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="classic-card classic-card-gold-top p-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a7317] bg-[#fefce8] border border-[#fef08a] px-2 py-0.5 rounded">
              Integration & Data Provenance
            </span>
            <ProvenanceBadge category="Live data" source="Active PostgreSQL Connectors" compact />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1.5 font-serif">
            Data Source Integrations & Connection Status
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Traceable external APIs, public datasets, and authorized ingestion pipelines.
          </p>
        </div>

        <a
          href={getDatasetDownloadUrl('tourism')}
          download
          className="px-3.5 py-1.5 bg-[#0c1b33] hover:bg-[#152e55] text-white text-xs font-semibold rounded shadow-sm flex items-center gap-1.5 transition-all"
        >
          <Download className="w-3.5 h-3.5 text-[#c59b27]" />
          Download Sourced Tourism Data
        </a>
      </div>

      {/* Grid of sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map((s) => (
          <div key={s.id} className="classic-card p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm tracking-tight">{s.name}</h3>
                  <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded mt-1 inline-block">
                    {s.category}
                  </span>
                </div>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border flex items-center gap-1 ${
                    s.connection_status === 'connected'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {s.connection_status}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div className="text-[11px] bg-slate-50 p-2.5 rounded border border-slate-200 font-mono break-all text-slate-700">
                  {s.endpoint_or_ref}
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Update Frequency:</span>
                  <span className="font-medium text-slate-700">{s.update_frequency}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Coverage:</span>
                  <span className="text-slate-700">{s.data_coverage}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Imported Records:</span>
                  <span className="font-bold text-[#1b3a6b] font-mono">{s.imported_records_count.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">
                {s.last_sync ? `Synced: ${new Date(s.last_sync).toLocaleDateString()}` : 'Not synced'}
              </span>
              <button
                onClick={() => handleTest(s.id)}
                disabled={testingId === s.id}
                className="px-3 py-1 bg-slate-100 hover:bg-[#fefce8] hover:border-[#c59b27] text-slate-800 font-semibold text-xs rounded border border-slate-300 flex items-center gap-1 transition-colors disabled:opacity-50"
              >
                <Zap className="w-3 h-3 text-[#c59b27]" />
                {testingId === s.id ? 'Testing...' : 'Test Connection'}
              </button>
            </div>

            {testResult && testResult.id === s.id && (
              <div
                className={`mt-2 p-2 rounded text-[11px] ${
                  testResult.success
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                    : 'bg-rose-50 text-rose-900 border border-rose-300'
                }`}
              >
                {testResult.message}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
