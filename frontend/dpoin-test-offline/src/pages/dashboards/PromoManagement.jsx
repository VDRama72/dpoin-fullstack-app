// src/pages/dashboards/PromoManagement.jsx
import React from 'react';
import useTitle from '../../hooks/useTitle';

export default function PromoManagement() {
  useTitle('Manajemen Promo - D’PoIN');

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">🎁 Manajemen Promo & Banner</h2>
      <p>Atur promo aktif, banner, dan jadwalnya.</p>
    </div>
  );
}
