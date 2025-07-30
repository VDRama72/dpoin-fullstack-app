// src/components/admin/user/ManagementCS.jsx
import React from 'react';
import UserManagement from '../UserManagement'; // Path relatif dari folder ini

export default function ManagementCS() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Manajemen CS</h2>
      {/* ✅ Tampilkan pengguna dengan role: cs, driver, penjual, pembeli */}
      <UserManagement filterRole={['cs', 'driver', 'penjual', 'pembeli']} />
    </div>
  );
}
