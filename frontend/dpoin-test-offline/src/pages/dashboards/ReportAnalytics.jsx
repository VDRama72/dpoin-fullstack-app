// src/pages/dashboards/ReportAnalytics.jsx
import React from 'react';
import useTitle from '../../hooks/useTitle';

export default function ReportAnalytics() {
  useTitle('Laporan & Analitik - D’PoIN');

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">📊 Laporan & Analitik</h2>
      <p>Grafik transaksi dan performa pengguna/mitra.</p>
    </div>
  );
}
