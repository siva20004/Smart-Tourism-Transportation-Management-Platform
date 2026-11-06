import React, { useEffect, useState } from 'react';
import { fetchForecast } from '../services/api';
import { ProvenanceBadge } from '../components/ProvenanceBadge';
import { TrendingUp, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const DemandForecasting: React.FC = () => {
  const [horizon, setHorizon] = useState<number>(7);
  const [forecastData, setForecastData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadForecast = (h: number) => {
    setLoading(true);
    fetchForecast(h)
      .then((res) => setForecastData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadForecast(horizon);
  }, [horizon]);

  return (
    <div className="space-y-6">
      <div className="classic-card classic-card-gold-top p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a7317] bg-[#fefce8] border border-[#fef08a] px-2 py-0.5 rounded">
              Machine Learning Pipeline
            </span>
            <ProvenanceBadge category="ML predictions" source="Scikit-Learn Evaluated Model" compact />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1.5 font-serif">
            AI-Powered Tourist Demand Forecasting
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Chronologically trained Random Forest Regressor evaluated against holdout test records.
          </p>
        </div>

        {/* Horizon selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Forecast Horizon:</span>
          {[7, 30].map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-all ${
                horizon === h
                  ? 'bg-[#0c1b33] text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              {h}-Day Forecast
            </button>
          ))}
        </div>
      </div>

      {/* Model Metadata & Metrics Card */}
      {forecastData && forecastData.evaluation_metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="classic-card p-4">
            <span className="text-xs text-slate-400">Model Name & Algorithm</span>
            <div className="text-sm font-bold text-slate-800 mt-1 truncate" title={forecastData.algorithm}>
              {forecastData.model_name}
            </div>
            <div className="text-[11px] text-slate-500 truncate">{forecastData.algorithm}</div>
          </div>
          <div className="classic-card p-4">
            <span className="text-xs text-slate-400">Mean Absolute Error (MAE)</span>
            <div className="text-xl font-black text-slate-900 mt-1 font-serif">
              ±{forecastData.evaluation_metrics.mae}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium">Validated on 2024 Test Split</div>
          </div>
          <div className="classic-card p-4">
            <span className="text-xs text-slate-400">Root Mean Squared Error (RMSE)</span>
            <div className="text-xl font-black text-slate-900 mt-1 font-serif">
              {forecastData.evaluation_metrics.rmse}
            </div>
            <div className="text-[11px] text-slate-500">Residual Variance</div>
          </div>
          <div className="classic-card p-4">
            <span className="text-xs text-slate-400">Mean Abs. Percentage Error (MAPE)</span>
            <div className="text-xl font-black text-[#1b3a6b] mt-1 font-serif">
              {forecastData.evaluation_metrics.mape}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold">Genuine Evaluation</div>
          </div>
        </div>
      )}

      {/* Forecast Chart */}
      {forecastData && forecastData.predictions && (
        <div className="classic-card p-6">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-serif">
                Projected Tourist Demand ({horizon}-Day Forecast with 90% Confidence Interval)
              </h3>
              <p className="text-xs text-slate-500">
                Upper and lower empirical prediction boundaries based on trained residuals
              </p>
            </div>
            <ProvenanceBadge category="ML predictions" source="fuji_tourist_demand_rf_v1" compact />
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData.predictions}>
                <defs>
                  <linearGradient id="boundGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="forecast_date" tick={{ fontSize: 11 }} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: any) => [`${Number(val).toLocaleString()} visitors`, '']} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="upper_bound" name="Upper 90% Bound" stroke="#d97706" strokeDasharray="3 3" fill="none" />
                <Area type="monotone" dataKey="predicted_demand" name="Predicted Demand" stroke="#1e50a2" strokeWidth={2.5} fillOpacity={1} fill="url(#boundGrad)" />
                <Area type="monotone" dataKey="lower_bound" name="Lower 90% Bound" stroke="#d97706" strokeDasharray="3 3" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
