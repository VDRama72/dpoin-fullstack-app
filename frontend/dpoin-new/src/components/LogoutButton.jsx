// ✅ FILE: frontend/src/components/LogoutButton.jsx (VERSI SEMPURNA)

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // ✅ PERBAIKAN: Hapus semua data pengguna
    localStorage.clear();
    // Kirim event agar komponen lain tahu ada perubahan
    window.dispatchEvent(new Event('storage'));
    // ✅ PERBAIKAN: Arahkan ke halaman utama setelah logout
    navigate('/', { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
}
