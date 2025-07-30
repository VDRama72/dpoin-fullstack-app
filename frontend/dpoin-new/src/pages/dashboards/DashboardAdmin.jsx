// src/pages/dashboards/DashboardAdmin.jsx
import React, { useEffect } from 'react';

export default function DashboardAdmin() {
  useEffect(() => {
    document.title = 'Dashboard Admin - D’PoIN';
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">D’PoIN Admin Panel</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-700">Total Driver</h2>
          <p className="text-3xl text-indigo-600">12</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-700">Total Penjual</h2>
          <p className="text-3xl text-indigo-600">8</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-700">Order Hari Ini</h2>
          <p className="text-3xl text-indigo-600">25</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-700">Pendapatan</h2>
          <p className="text-3xl text-green-600">Rp 1.200.000</p>
        </div>
      </div>
    </div>
  );
}
