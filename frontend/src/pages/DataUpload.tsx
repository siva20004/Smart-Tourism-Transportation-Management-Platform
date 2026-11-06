import React, { useEffect, useState } from 'react';
import { previewUpload, confirmUpload, fetchImportHistory, getDatasetDownloadUrl, getTemplateDownloadUrl } from '../services/api';
import { ProvenanceBadge } from '../components/ProvenanceBadge';
import { Upload, Download, FileText, CheckCircle2, History, Database, ArrowDownToLine, Table } from 'lucide-react';

export const DataUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [importType, setImportType] = useState<string>('booking');
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');

  const loadHistory = () => {
    fetchImportHistory().then((res) => setHistory(res.data || [])).catch(console.error);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setSuccessMsg('');
      const formData = new FormData();
      formData.append('file', file);
      setLoading(true);
      try {
        const res = await previewUpload(formData);
        setPreviewData(res.data);
      } catch (err: any) {
        alert(err.response?.data?.detail || "Preview failed");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleConfirm = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('import_type', importType);
    setLoading(true);
    try {
      const res = await confirmUpload(formData);
      setSuccessMsg(res.data.message);
      setPreviewData(null);
      setSelectedFile(null);
      loadHistory();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Import confirmation failed");
    } finally {
      setLoading(false);
    }
  };

  const availableDatasets = [
    {
      type: 'tourism',
      title: 'Yamanashi Tourism Historical Dataset',
      title_ja: '山梨県・富士五湖観光来訪者統計（1,460日分）',
      records: '1,460 Records',
      coverage: '2021-01-01 to 2024-12-31',
      source: 'Yamanashi Tourism Survey & JNTO Official Statistics',
      format: 'CSV (Comma Delimited)'
    },
    {
      type: 'hotel',
      title: 'Fuji Kyuko Hotel Occupancy Records',
      title_ja: 'ホテル客室稼働実績データ（PMS取込済台帳）',
      records: 'Active Verified Ingestion',
      coverage: 'Highland Resort & Fuji View Hotel',
      source: 'Fuji Kyuko Hotel Group Daily Property Management System',
      format: 'CSV (Comma Delimited)'
    },
    {
      type: 'booking',
      title: 'Authorized Corporate Booking Ledger',
      title_ja: '公式予約台帳・売上レコード（検証済）',
      records: 'Active Verified Ledger',
      coverage: 'Hotel Packages & Expressway Buses',
      source: 'Authorized Corporate Reservation System',
      format: 'CSV (Comma Delimited)'
    },
    {
      type: 'passenger',
      title: 'Fujikyuko Line Passenger Flow Dataset',
      title_ja: '富士急行線 輸送人員実績データ',
      records: 'Corridor Flow Records',
      coverage: 'Otsuki — Kawaguchiko Corridors',
      source: 'Fuji Sanroku Electric Railway Passenger Flow',
      format: 'CSV (Comma Delimited)'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="classic-card classic-card-gold-top p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a7317] bg-[#fefce8] border border-[#fef08a] px-2 py-0.5 rounded">
              Data Governance & Export Gateway
            </span>
            <ProvenanceBadge category="Uploaded data" source="PostgreSQL Production Persistence" compact />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1.5 font-serif">
            Dataset Ingestion & Export Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ingest corporate files with schema validation, or download already uploaded datasets directly from PostgreSQL.
          </p>
        </div>

        {/* Template Downloads */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs text-slate-500 font-medium">CSV Templates:</span>
          <a
            href={getTemplateDownloadUrl('booking')}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium border border-slate-300 flex items-center gap-1 transition-colors"
          >
            <Download className="w-3 h-3 text-slate-500" />
            Booking Template
          </a>
          <a
            href={getTemplateDownloadUrl('hotel')}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium border border-slate-300 flex items-center gap-1 transition-colors"
          >
            <Download className="w-3 h-3 text-slate-500" />
            Hotel Template
          </a>
        </div>
      </div>

      {/* SECTION 1: DOWNLOAD STORED / UPLOADED DATASETS */}
      <div className="classic-card p-6">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 font-serif">
              <ArrowDownToLine className="w-4 h-4 text-[#c59b27]" />
              Download Stored & Uploaded Datasets (PostgreSQL Direct Export)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant one-click CSV export of official historical tourism statistics and corporate records currently in the database.
            </p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded border border-slate-200">
            Export Format: UTF-8 CSV
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableDatasets.map((ds) => (
            <div
              key={ds.type}
              className="p-4 rounded-lg border border-slate-200 bg-[#fbfcfd] hover:border-slate-300 hover:shadow-classic transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs tracking-tight">{ds.title}</h4>
                    <div className="text-[11px] text-slate-500">{ds.title_ja}</div>
                  </div>
                  <span className="text-[10px] bg-slate-200/80 text-slate-700 font-mono px-1.5 py-0.5 rounded font-semibold">
                    {ds.format}
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Record Count:</span>
                    <span className="font-bold text-slate-800">{ds.records}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Coverage:</span>
                    <span className="text-slate-700">{ds.coverage}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Traceable Source:</span>
                    <span className="text-slate-500 truncate max-w-[200px]" title={ds.source}>
                      {ds.source}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified in Database
                </span>
                <a
                  href={getDatasetDownloadUrl(ds.type)}
                  download
                  className="px-3.5 py-1.5 bg-[#0c1b33] hover:bg-[#152e55] text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-[#c59b27]" />
                  Download Dataset (.CSV)
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: UPLOAD & INGESTION FORM */}
      <div className="classic-card p-6">
        <h3 className="font-bold text-slate-900 text-sm mb-1 font-serif flex items-center gap-2">
          <Upload className="w-4 h-4 text-[#1b3a6b]" />
          Authorized File Ingestion (CSV / XLSX / JSON)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Upload official reservation ledgers or statistics. Records undergo strict schema detection and duplicate verification before persistence.
        </p>

        <div className="p-8 border-2 border-dashed border-slate-200 rounded-lg text-center bg-[#fafbfc]">
          <Upload className="w-9 h-9 text-slate-400 mx-auto mb-2" />
          <h4 className="text-xs font-bold text-slate-800">Select File from Authorized Enterprise System</h4>
          <p className="text-[11px] text-slate-500 mt-0.5 mb-4">Supported formats: .CSV, .XLSX, .JSON</p>

          <div className="inline-flex items-center gap-3">
            <select
              value={importType}
              onChange={(e) => setImportType(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-800 font-medium"
            >
              <option value="booking">Booking & Reservation Ledger</option>
              <option value="hotel">Hotel Occupancy PMS Audit</option>
              <option value="tourism">Tourism Statistics Report</option>
            </select>

            <label className="px-4 py-2 bg-[#0c1b33] hover:bg-[#152e55] text-white rounded text-xs font-bold cursor-pointer shadow-sm transition-all">
              Browse File...
              <input type="file" accept=".csv,.xlsx,.xls,.json" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {selectedFile && (
            <div className="mt-3 text-xs text-slate-700 font-semibold font-mono">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </div>
          )}
        </div>

        {successMsg && (
          <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Preview Card */}
        {previewData && (
          <div className="mt-5 p-5 border border-slate-200 rounded-lg bg-white space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Schema Verification Summary</h4>
                <p className="text-xs text-slate-500">
                  {previewData.total_rows} records detected • {previewData.duplicates_count} duplicates flagged
                </p>
              </div>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold transition-all shadow-sm disabled:opacity-50"
              >
                {loading ? 'Ingesting...' : 'Confirm & Commit to PostgreSQL'}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {previewData.columns.map((c: any, idx: number) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="font-bold text-slate-800 block truncate">{c.name}</span>
                  <span className="text-[10px] text-slate-500 block">Type: {c.dtype}</span>
                  <span className="text-[10px] text-amber-600 block">Missing: {c.missing_count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: INGESTION AUDIT TRAIL */}
      <div className="classic-card p-6">
        <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2 font-serif">
          <History className="w-4 h-4 text-slate-500" />
          Ingestion Audit Trail (Recent Uploads & Downloads)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Filename</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Total</th>
                <th className="py-2.5 px-3">Valid</th>
                <th className="py-2.5 px-3">Invalid/Dup</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Uploaded By</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-slate-900">{h.filename}</td>
                  <td className="py-2.5 px-3 uppercase text-[10px] font-bold text-slate-600">{h.import_type}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-800 font-mono">{h.total_records}</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-700 font-mono">{h.valid_records}</td>
                  <td className="py-2.5 px-3 font-medium text-rose-600 font-mono">{h.invalid_records}</td>
                  <td className="py-2.5 px-3">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                      {h.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{h.uploaded_by}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{h.timestamp}</td>
                  <td className="py-2.5 px-3 text-right">
                    <a
                      href={getDatasetDownloadUrl(h.import_type)}
                      download
                      className="inline-flex items-center gap-1 text-[11px] text-[#1b3a6b] hover:text-[#0c1b33] font-semibold hover:underline"
                    >
                      <Download className="w-3 h-3" />
                      Export CSV
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
