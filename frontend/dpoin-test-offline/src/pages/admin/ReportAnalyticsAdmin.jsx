// src/pages/admin/ReportAnalyticsAdmin.jsx

import React, { useEffect, useState } from 'react';
import useTitle from '../../hooks/useTitle';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import api from '../../services/api';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

export default function ReportAnalyticsAdmin() {
  useTitle('📊 Laporan & Analitik - D’PoIN Admin');

  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get('/reports/transactions/summary');
        setSummary(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Gagal mengambil data transaksi:', error);
      }
    };

    fetchTransactions();
  }, []);

  const chartData = {
    labels: summary.map(item => item.tanggal),
    datasets: [
      {
        label: 'Total Transaksi (Rp)',
        data: summary.map(item => item.total_transaksi),
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">📊 Laporan & Analitik</h2>
      <p className="text-gray-600 mb-4">
        Grafik transaksi dan performa pengguna/mitra.
      </p>

      {loading ? (
        <div className="text-gray-500">⏳ Memuat data transaksi...</div>
      ) : (
        <div className="mb-6">
          <Line data={chartData} />
        </div>
      )}

      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        onClick={() => {
          window.open('http://localhost:4000/api/reports/transactions/export', '_blank');
        }}
      >
        📥 Export Laporan (CSV)
      </button>
    </div>
  );
}
