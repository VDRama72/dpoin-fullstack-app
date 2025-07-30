// src/pages/admin/CSManagementAdmin.jsx
import React from 'react';
import useTitle from '../../hooks/useTitle';

export default function CSManagementAdmin() {
  useTitle('☎️ Manajemen CS & Komplain - D’PoIN Admin');

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">☎️ Manajemen CS & Komplain</h2>
      <p className="text-gray-600 mb-4">Kelola laporan dan keluhan dari pembeli, penjual, atau driver.</p>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-red-800">Komplain Baru</h3>
          <p className="text-2xl font-bold text-red-600">4</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-yellow-800">Dalam Proses</h3>
          <p className="text-2xl font-bold text-yellow-600">2</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-green-800">Selesai</h3>
          <p className="text-2xl font-bold text-green-600">10</p>
        </div>
      </div>

      {/* Tabel Komplain */}
      <div className="overflow-auto">
        <table className="min-w-full text-sm text-left border text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              <th className="px-4 py-2">Nama Pengguna</th>
              <th className="px-4 py-2">Peran</th>
              <th className="px-4 py-2">Isi Komplain</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2">Ani Puspita</td>
              <td className="px-4 py-2">Pembeli</td>
              <td className="px-4 py-2">Makanan datang terlambat</td>
              <td className="px-4 py-2 text-yellow-600">Dalam Proses</td>
              <td className="px-4 py-2">2025-06-24</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">Warung Barokah</td>
              <td className="px-4 py-2">Penjual</td>
              <td className="px-4 py-2">Saldo tidak masuk</td>
              <td className="px-4 py-2 text-green-600">Selesai</td>
              <td className="px-4 py-2">2025-06-23</td>
            </tr>
            {/* Tambahan baris bisa dari backend nanti */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
