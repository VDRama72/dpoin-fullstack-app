// src/pages/dashboards/ProductManagement.jsx
import React from 'react';
import useTitle from '../../hooks/useTitle';

export default function ProductManagement() {
  useTitle('Manajemen Produk - D’PoIN');

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">📦 Manajemen Produk</h2>
      <p className="text-gray-600 mb-2">Fitur ini untuk mengelola daftar produk, harga, deskripsi, dan stok barang.</p>
      <div className="text-gray-400 italic">🚧 Fitur ini sedang dalam pengembangan.</div>
    </div>
  );
}
