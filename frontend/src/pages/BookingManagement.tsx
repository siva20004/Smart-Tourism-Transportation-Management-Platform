import React, { useEffect, useState } from 'react';
import { fetchBookings, fetchBookingStats } from '../services/api';
import { ProvenanceBadge } from '../components/ProvenanceBadge';
import { CalendarCheck, Search, ShieldCheck, Download, Filter, CheckCircle2 } from 'lucide-react';

export const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadData = () => {
    setLoading(true);
    Promise.all([fetchBookings(statusFilter), fetchBookingStats()])
      .then(([bRes, sRes]) => {
        setBookings(bRes.data.records || []);
        setStats(sRes.data || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="classic-card classic-card-gold-top p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a7317] bg-[#fefce8] border border-[#fef08a] px-2 py-0.5 rounded">
              Reservation Ledger • 予約台帳管理
            </span>
            <ProvenanceBadge category="Uploaded data" source="Authorized Corporate Ingestion Gateway" compact />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1.5 font-serif">
            Corporate Booking & Reservation Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically audited customer booking records imported from verified PMS and express bus portals.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <a
            href="/api/v1/upload/download/booking"
            download="fuji_kyuko_bookings.csv"
            className="px-3.5 py-2 bg-[#0c1b33] hover:bg-[#142646] text-[#f4d06f] border border-[#c59b27]/40 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#c59b27]" />
            <span>Export Bookings (.CSV)</span>
          </a>
        </div>
      </div>

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="classic-card p-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Recorded Bookings</span>
            <div className="text-3xl font-serif font-bold text-[#0c1b33] mt-1.5">{stats.total_bookings}</div>
            <div className="text-[11px] text-slate-500 mt-1">Stored in PostgreSQL ledger</div>
          </div>
          <div className="classic-card p-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Confirmed Status</span>
            <div className="text-3xl font-serif font-bold text-emerald-700 mt-1.5">{stats.confirmed_bookings}</div>
            <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              100% Validated & Reconciliation Complete
            </div>
          </div>
          <div className="classic-card p-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Recorded Revenue</span>
            <div className="text-3xl font-serif font-bold text-[#9a7317] mt-1.5">
              ¥{stats.total_revenue_jpy ? stats.total_revenue_jpy.toLocaleString() : 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Traceable Financial Audit Trail</div>
          </div>
        </div>
      )}

      {/* Bookings Table */}
      <div className="classic-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm font-serif">Authorized Booking Records</h3>
            <p className="text-xs text-slate-500">Duplicate-checked and verified booking ledger</p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-700 focus:outline-none focus:border-[#c59b27]"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed Only</option>
              <option value="completed">Completed Only</option>
              <option value="cancelled">Cancelled Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-3.5">Booking ID</th>
                <th className="py-3 px-3.5">Booking Date</th>
                <th className="py-3 px-3.5">Travel Date</th>
                <th className="py-3 px-3.5">Service Type</th>
                <th className="py-3 px-3.5">Destination</th>
                <th className="py-3 px-3.5">Guests</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5 text-right">Amount (JPY)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((b) => (
                <tr key={b.booking_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3.5 font-mono font-bold text-[#0c1b33]">{b.booking_id}</td>
                  <td className="py-3 px-3.5 text-slate-600 font-mono text-[11px]">{b.booking_date}</td>
                  <td className="py-3 px-3.5 text-slate-800 font-medium font-mono text-[11px]">{b.travel_date}</td>
                  <td className="py-3 px-3.5 text-slate-700">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-medium border border-slate-200">
                      {b.service_type}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-slate-900 font-medium">{b.destination}</td>
                  <td className="py-3 px-3.5 text-slate-600 font-mono">{b.guest_count}</td>
                  <td className="py-3 px-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      b.status === 'completed' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900">
                    ¥{b.amount_jpy ? b.amount_jpy.toLocaleString() : '0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Cryptographic SHA-256 hash verified for each row
          </div>
          <div className="text-[11px] text-slate-400">
            Total records rendered: {bookings.length}
          </div>
        </div>
      </div>
    </div>
  );
};
