// ✅ FILE: src/pages/seller/Disclaimer.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Disclaimer() {
  const navigate = useNavigate();

  const handleAgree = () => {
    navigate('/seller/products');
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md p-6 rounded">
      <h2 className="text-xl font-bold mb-4 text-gray-800">📢 Disclaimer</h2>
      <p className="mb-4 text-gray-700">
        Dengan mengunggah produk ke platform D’PoIN, Anda menyetujui bahwa:
      </p>
      <ul className="list-disc ml-6 mb-4 text-gray-700">
        <li>Produk yang diunggah adalah legal dan sesuai dengan peraturan hukum yang berlaku.</li>
        <li>Komisi sebesar <strong>10%</strong> dari setiap transaksi akan dikenakan oleh sistem D’PoIN untuk operasional platform.</li>
        <li>Penjual bertanggung jawab penuh atas ketersediaan dan pengiriman produk.</li>
      </ul>
      <p className="mb-6 text-gray-700">
        Mohon pastikan informasi produk yang Anda input adalah benar dan lengkap.
      </p>
      <button onClick={handleAgree} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
        ✅ Saya Setuju & Lanjutkan
      </button>
    </div>
  );
}
