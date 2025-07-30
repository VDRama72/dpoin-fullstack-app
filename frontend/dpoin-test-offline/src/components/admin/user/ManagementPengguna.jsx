// src/components/admin/user/ManagementPengguna.jsx
import React from 'react';
import UserManagement from '../UserManagement'; // ✅ Path diperbaiki

export default function ManagementPengguna() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Manajemen Pengguna</h2>
      {/* ✅ Komponen manajemen user umum */}
      <UserManagement filterRole={null} />
    </div>
  );
}
