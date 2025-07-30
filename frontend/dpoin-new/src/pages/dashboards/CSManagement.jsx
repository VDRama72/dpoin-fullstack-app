// src/pages/dashboards/CSManagement.jsx
import React from 'react';
import useTitle from '../../hooks/useTitle';

export default function CSManagement() {
  useTitle('Manajemen Komplain - D’PoIN');

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">☎️ Manajemen CS & Komplain</h2>
      <p>Atur dan tangani laporan dari pengguna.</p>
    </div>
  );
}
