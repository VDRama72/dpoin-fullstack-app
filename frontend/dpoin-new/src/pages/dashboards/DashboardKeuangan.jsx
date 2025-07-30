// src/pages/dashboards/DashboardKeuangan.jsx
import React from 'react';
import useTitle from '../../hooks/useTitle';

export default function DashboardKeuangan() {
  useTitle('Dashboard Keuangan - D’PoIN');

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Dashboard Keuangan</h1>
        <p className="text-gray-700">Pantau keuangan dan laporan transaksi D’PoIN.</p>
        <ul className="mt-4 list-disc list-inside text-gray-600">
          <li>Rekapitulasi pendapatan</li>
          <li>Laporan keuangan bulanan</li>
          <li>Validasi pembayaran</li>
        </ul>
      </div>
    </div>
  );
}
