// src/pages/dashboards/DashboardPenjual.jsx
import React from 'react';
import useTitle from '../../hooks/useTitle';

export default function DashboardPenjual() {
  useTitle('Dashboard Penjual - D’PoIN');

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">Dashboard Penjual</h1>
        <p className="text-gray-700">Kelola produk dan pantau pesanan pelanggan.</p>
        <ul className="mt-4 list-disc list-inside text-gray-600">
          <li>Daftar produk & stok</li>
          <li>Status pesanan</li>
          <li>Ulasan pembeli</li>
        </ul>
      </div>
    </div>
  );
}
