// src/pages/Home.jsx
import React from 'react';
import StatsCard from '../components/StatsCard';

export default function Home() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Selamat Datang di Admin D’PoIN</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Pengguna" value="1,234" icon="👥" color="blue" />
        <StatsCard title="Pendapatan Hari Ini" value="Rp 4.500.000" icon="💰" color="green" />
        <StatsCard title="Pesanan Baru" value="23" icon="🛍️" color="yellow" />
        <StatsCard title="Driver Aktif" value="89" icon="🛵" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-4">Daftar Pengguna Terbaru</h3>
          <table className="min-w-full table-auto text-sm text-left">
            <thead className="text-gray-600 border-b">
              <tr>
                <th className="py-2">Nama</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-2">Budi Santoso</td>
                <td className="py-2">budi@example.com</td>
                <td className="py-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">Pembeli</span>
                </td>
              </tr>
              <tr>
                <td className="py-2">Asep Driver</td>
                <td className="py-2">asep@driver.com</td>
                <td className="py-2">
                  <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">Driver</span>
                </td>
              </tr>
              <tr>
                <td className="py-2">Rina Toko</td>
                <td className="py-2">rina@penjual.com</td>
                <td className="py-2">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs">Penjual</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-4">Statistik Bulan Ini</h3>
          <div className="h-48 flex items-center justify-center border border-dashed border-gray-300 rounded text-gray-400">
            ← Grafik Pendapatan / Pesanan (bisa pakai Chart.js nanti)
          </div>
        </div>
      </div>
    </div>
  );
}