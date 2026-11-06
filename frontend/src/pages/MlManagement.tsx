import React, { useEffect, useState } from 'react';
import { fetchMLModels, trainMLModel } from '../services/api';
import { ProvenanceBadge } from '../components/ProvenanceBadge';
import type { MLModelItem } from '../types';
import { Cpu, Play, CheckCircle2, AlertTriangle, ShieldCheck, Award, FileCode2 } from 'lucide-react';

export const MlManagement: React.FC = () => {
  const [models, setModels] = useState<MLModelItem[]>([]);
  const [trainingId, setTrainingId] = useState<number | null>(null);
  const [trainResult, setTrainResult] = useState<any>(null);

  const loadModels = () => {
    fetchMLModels().then((res) => setModels(res.data || [])).catch(console.error);
  };

  useEffect(() => {
    loadModels();
  }, []);

  const handleTrain = async (id: number) => {
    setTrainingId(id);
    setTrainResult(null);
    try {
      const res = await trainMLModel(id);
      setTrainResult(res.data);
      loadModels();
    } catch (e: any) {
      alert(e.response?.data?.detail || "Training failed");
    } finally {
      setTrainingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="classic-card classic-card-gold-top p-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a7317] bg-[#fefce8] border border-[#fef08a] px-2 py-0.5 rounded">
              Model Governance • 機械学習パイプライン
            </span>
            <ProvenanceBadge category="ML predictions" source="Scikit-Learn Joblib Models (Chronological Holdout)" compact />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1.5 font-serif">
            Machine Learning Pipeline & Model Governance Registry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit trail of time-series algorithms, chronological splits, and residual error metrics trained on Yamanashi official data.
          </p>
        </div>
      </div>

      {trainResult && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-900 space-y-1 shadow-sm">
          <div className="font-bold flex items-center gap-1.5 text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Model Retrained Successfully: {trainResult.model_name}
          </div>
          <div className="text-slate-700 font-mono text-[11px]">
            Records: {trainResult.records_used} ({trainResult.split}) • MAE: ±{trainResult.evaluation_metrics?.mae} • RMSE: {trainResult.evaluation_metrics?.rmse} • MAPE: {trainResult.evaluation_metrics?.mape}%
          </div>
        </div>
      )}

      {/* Models List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {models.map((m) => (
          <div key={m.id} className="classic-card p-6 flex flex-col justify-between hover:border-[#c59b27]/40 transition-all">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-serif">{m.model_name}</h3>
                  <span className="text-xs text-[#9a7317] font-semibold">{m.target_metric}</span>
                </div>
                <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded text-[10px] font-bold border border-emerald-200 uppercase tracking-wider">
                  {m.status} (v{m.version})
                </span>
              </div>

              <div className="mt-5 space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Algorithm:</span>
                  <span className="font-mono font-medium text-slate-800">{m.algorithm}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Training Dataset:</span>
                  <span className="text-slate-800 font-medium truncate max-w-[220px]" title={m.training_dataset}>
                    {m.training_dataset}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Chronological Split:</span>
                  <span className="font-mono text-slate-700">{m.training_period}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Model File Artifact:</span>
                  <span className="font-mono text-slate-600 text-[11px] truncate max-w-[200px]" title={m.file_path}>
                    {m.file_path?.split(/[\\/]/).pop()}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg mt-3">
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#c59b27]" />
                    Holdout Evaluation Metrics
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <div className="text-[10px] text-slate-400">MAE</div>
                      <div className="font-mono font-bold text-slate-900 text-xs mt-0.5">±{m.mae}</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <div className="text-[10px] text-slate-400">RMSE</div>
                      <div className="font-mono font-bold text-slate-900 text-xs mt-0.5">{m.rmse}</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <div className="text-[10px] text-slate-400">MAPE</div>
                      <div className="font-mono font-bold text-slate-900 text-xs mt-0.5">{m.mape}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                Trained: {m.last_trained ? m.last_trained.split('T')[0] : 'N/A'}
              </span>

              <button
                onClick={() => handleTrain(m.id)}
                disabled={trainingId === m.id}
                className="px-3.5 py-1.5 bg-[#0c1b33] hover:bg-[#142646] text-[#f4d06f] border border-[#c59b27]/40 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 text-[#c59b27]" />
                {trainingId === m.id ? 'Retraining...' : 'Retrain on Latest Data'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Governance Notice */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#c59b27] shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900">Zero Synthetic Data Guarantee:</strong>
          <p className="mt-0.5">
            Models registered here use only authentic Yamanashi Prefectural Government Tourism Statistics, Japan National Tourism Organization (JNTO) monthly totals, and JMA meteorological records. No synthetic target distributions or fabricated predictions are permitted.
          </p>
        </div>
      </div>
    </div>
  );
};
