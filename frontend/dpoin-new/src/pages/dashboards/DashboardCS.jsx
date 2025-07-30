// src/pages/dashboards/DashboardCS.jsx
import React from 'react';
import useTitle from '../../hooks/useTitle';

export default function DashboardCS() {
  useTitle('Dashboard CS - D’PoIN');

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-pink-700 mb-4">Dashboard Customer Service</h1>
        <p className="text-gray-700">Layanan pelanggan dan keluhan pengguna.</p>
        <ul className="mt-4 list-disc list-inside text-gray-600">
          <li>Respon tiket pelanggan</li>
          <li>Riwayat chat dan keluhan</li>
          <li>Monitoring kepuasan pengguna</li>
        </ul>
      </div>
    </div>
  );
}
