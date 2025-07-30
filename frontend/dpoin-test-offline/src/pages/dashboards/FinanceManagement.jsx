// src/pages/dashboards/FinanceManagement.jsx
import React from 'react';
import useTitle from '../../hooks/useTitle';

export default function FinanceManagement() {
  useTitle('Manajemen Keuangan - D’PoIN');

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">💰 Manajemen Keuangan</h2>
      <p>Monitor transaksi, withdraw dan saldo mitra.</p>
    </div>
  );
}
