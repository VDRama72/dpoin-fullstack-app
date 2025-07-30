// src/pages/dashboards/DashboardCEO.jsx
import React, { useEffect, useState } from 'react';
import useTitle from '../../hooks/useTitle';
import axios from 'axios';

export default function DashboardCEO() {
  useTitle('Dashboard CEO - D’PoIN');

  const [summary, setSummary] = useState({
    totalTransaksi: 0,
    totalPengguna: 0,
    totalPenghasilan: 0,
    terakhirLogin: 'Belum ada data'
  });

  useEffect(() => {
    // Contoh fetch dari backend (endpoint bisa kamu ganti nanti)
    const fetchSummary = async () => {
      try {
        // Ganti URL ini dengan backend kamu
        const res = await axios.get('http://localhost:4000/api/summary/ceo', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          }
        });

        setSummary(res.data);
      } catch (err) {
        // fallback data sementara jika API gagal
        console.error(err);
        setSummary({
          totalTransaksi: 324,
          totalPengguna: 97,
          totalPenghasilan: 15200000,
          terakhirLogin: '2025-06-23 10:42'
        });
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-3xl font-bold text-gray-800">Dashboard CEO</div>

        {/* Statistik Ringkas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg shadow">
            <h4 className="text-gray-500 text-sm">Total Transaksi</h4>
            <p className="text-2xl font-semibold text-blue-600">{summary.totalTransaksi}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow">
            <h4 className="text-gray-500 text-sm">Total Pengguna</h4>
            <p className="text-2xl font-semibold text-green-600">{summary.totalPengguna}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow">
            <h4 className="text-gray-500 text-sm">Total Penghasilan</h4>
            <p className="text-2xl font-semibold text-indigo-600">Rp {summary.totalPenghasilan.toLocaleString()}</p>
          </div>
        </div>

        {/* Aktivitas */}
        <div className="bg-white p-5 rounded-lg shadow">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Aktivitas Terakhir</h4>
          <p className="text-gray-600">Login terakhir CEO: <strong>{summary.terakhirLogin}</strong></p>
        </div>

        {/* Placeholder grafik performa */}
        <div className="bg-white p-5 rounded-lg shadow text-gray-600 text-center italic">
          📊 Grafik performa penjualan bulanan akan ditampilkan di sini.
        </div>
      </div>
    </div>
  );
}
