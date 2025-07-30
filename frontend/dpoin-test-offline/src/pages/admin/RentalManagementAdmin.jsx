// src/pages/admin/RentalManagementAdmin.jsx

import React, { useEffect, useState } from 'react';
import useTitle from '../../hooks/useTitle';
import api from '../../services/api';

export default function RentalManagementAdmin() {
  useTitle('🚗 Manajemen Rental - Admin');

  const [rentals, setRentals] = useState([]);

  const fetchRentals = async () => {
    try {
      const res = await api.get('/admin/rentals'); // Endpoint asumsi
      setRentals(res.data);
    } catch (err) {
      console.error('Gagal mengambil data rental:', err);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">🚗 Manajemen Rental</h2>
      <p className="text-gray-600 mb-4">Pantau dan kelola penyewaan kendaraan oleh pengguna dan mitra.</p>

      <div className="overflow-auto">
        <table className="min-w-full text-sm text-left text-gray-700 border">
          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Nama Pengguna</th>
              <th className="px-4 py-2">Kendaraan</th>
              <th className="px-4 py-2">Tanggal Sewa</th>
              <th className="px-4 py-2">Durasi</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((rental) => (
              <tr key={rental._id} className="border-t">
                <td className="px-4 py-2">{rental._id}</td>
                <td className="px-4 py-2">{rental.userName}</td>
                <td className="px-4 py-2">{rental.vehicleName}</td>
                <td className="px-4 py-2">{new Date(rental.startDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">{rental.duration} hari</td>
                <td className="px-4 py-2 capitalize">{rental.status}</td>
              </tr>
            ))}
            {rentals.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-400 py-4">Belum ada data rental.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
