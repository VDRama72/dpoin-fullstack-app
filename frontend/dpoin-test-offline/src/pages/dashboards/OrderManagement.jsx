// src/pages/dashboards/OrderManagement.jsx
import React from 'react';
import useTitle from '../../hooks/useTitle';

export default function OrderManagement() {
  useTitle('Manajemen Pesanan - D’PoIN');

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-700 mb-4">🧾 Manajemen Pesanan</h1>
      <p>Di sini nanti daftar pesanan akan ditampilkan...</p>
    </div>
  );
}
