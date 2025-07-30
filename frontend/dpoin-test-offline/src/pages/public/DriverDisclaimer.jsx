// ✅ FILE: src/pages/public/DriverDisclaimer.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DriverDisclaimer() {
  const navigate = useNavigate();

  const handleAgree = () => {
    // Langsung lanjut ke halaman signup driver
    navigate('/driver/signup');
  };

  const handleBack = () => {
    // Kembali ke Etalase (atau bisa ke halaman sebelumnya)
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">📄 Syarat & Ketentuan Driver</h1>
      <div className="bg-white border p-4 rounded shadow text-sm text-gray-700 space-y-3 mb-6">
        <p>Dengan mendaftar sebagai driver D’PoIN, Anda menyetujui bahwa:</p>
        <ul className="list-disc ml-6">
          <li>Memiliki SIM aktif dan kendaraan dalam kondisi baik.</li>
          <li>Siap bertanggung jawab atas barang dan penumpang yang dibawa.</li>
          <li>Mematuhi aturan berkendara dan etika layanan D’PoIN.</li>
          <li>Siap menjaga keselamatan dan kenyamanan pelanggan.</li>
          <li>Semua data yang diisi saat pendaftaran adalah benar.</li>
        </ul>
        <p>Jika Anda setuju dengan syarat & ketentuan di atas, silakan lanjutkan pendaftaran.</p>
      </div>

      <div className="flex justify-between gap-4">
        <button
          onClick={handleBack}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded w-full"
        >
          ⬅️ Kembali
        </button>
        <button
          onClick={handleAgree}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded w-full"
        >
          ✅ Setuju & Lanjut Daftar
        </button>
      </div>
    </div>
  );
}
