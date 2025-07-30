// src/pages/dashboards/DashboardPembeli.jsx
import React from 'react';
import useTitle from '../../hooks/useTitle';

export default function DashboardPembeli() {
  useTitle('Dashboard Pembeli - D’PoIN');

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-teal-700 mb-4">Dashboard Pembeli</h1>
        <p className="text-gray-700">Lacak pesanan, riwayat transaksi, dan ulasan.</p>
        <ul className="mt-4 list-disc list-inside text-gray-600">
          <li>Riwayat pemesanan</li>
          <li>Pesanan aktif</li>
          <li>Review produk dan layanan</li>
        </ul>
      </div>
    </div>
  );
}
