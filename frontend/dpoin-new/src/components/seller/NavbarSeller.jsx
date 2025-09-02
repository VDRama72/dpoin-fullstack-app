// ✅ FILE: src/components/seller/NavbarSeller.jsx (VERSI AKHIR DAN SEMPURNA)

import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Tambahkan useNavigate

export default function NavbarSeller() {
  const navigate = useNavigate(); // ✅ Gunakan hook useNavigate
  const sellerName = localStorage.getItem('userName') || 'Penjual';

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('storage'));
    navigate('/', { replace: true }); // ✅ PERBAIKAN: Redirect ke halaman utama
  };

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <div className="text-xl font-bold text-gray-800">
        D’PoIN Seller Panel
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-700 font-medium hidden sm:block">
          👋 Hai, {sellerName}
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}