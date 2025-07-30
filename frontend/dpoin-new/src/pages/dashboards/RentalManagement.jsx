// src/pages/dashboards/RentalManagement.jsx
import React from 'react';
import useTitle from '../../hooks/useTitle';

export default function RentalManagement() {
  useTitle('Manajemen Rental - D’PoIN');

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">🚗 Manajemen Rental</h2>
      <p className="text-gray-600 mb-2">Kelola data penyewaan kendaraan atau produk lainnya yang tersedia.</p>
      <div className="text-gray-400 italic">🚧 Fitur ini sedang dalam pengembangan.</div>
    </div>
  );
}
