// ✅ FILE: src/pages/seller/SellerDisclaimer.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SellerDisclaimer() {
  const navigate = useNavigate();

  const handleAgree = () => {
    localStorage.setItem('disclaimerAccepted', 'true');
    window.dispatchEvent(new Event('storage'));
    navigate('/seller/signup'); // ✅ redirect ke form pendaftaran
  };

  const handleBack = () => {
    navigate('/etalase');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white p-6">
      <div className="max-w-xl w-full bg-white shadow-2xl rounded-2xl p-8 border">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-indigo-700">📢 Syarat & Ketentuan Penjual</h1>
        <div className="text-sm text-gray-700 space-y-4 mb-6 leading-relaxed">
          <p>Dengan menjadi penjual di platform ini, Anda menyetujui bahwa:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Komisi 10% dari penjualan.</li>
            <li>Harga belum termasuk ongkos kirim.</li>
            <li>Ongkir dihitung otomatis berdasar jarak.</li>
            <li>Data produk harus valid dan tidak melanggar hukum.</li>
            <li>Penjual wajib menjaga kualitas pelayanan.</li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAgree}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-3 rounded-lg w-full transition"
          >
            ✅ Saya Setuju dan Lanjutkan
          </button>
          <button
            onClick={handleBack}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-3 rounded-lg w-full transition"
          >
            ⬅️ Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
