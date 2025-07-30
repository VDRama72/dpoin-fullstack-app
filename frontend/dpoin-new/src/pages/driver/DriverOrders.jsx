// frontend/pages/driver/DriverOrder.jsx

import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import SidebarDriver from '../../components/SidebarDriver';
import LogoutButton from '../../components/LogoutButton';

export default function DriverOrder() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    api.get('/orders')
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => console.error('Gagal mengambil data order:', err));
  }, []);

  const filteredOrders = orders.filter((order) => {
    return (
      order.driverId &&
      (filterStatus === 'all' || order.status === filterStatus)
    );
  });

  return (
    <div className="flex min-h-screen">
      <SidebarDriver />
      <div className="flex-1 p-6 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">📦 Pesanan Saya (Driver)</h1>
          <LogoutButton />
        </div>

        <div className="mb-4">
          <label className="mr-2 text-sm">Filter Status:</label>
          <select
            className="border px-2 py-1 text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Semua</option>
            <option value="pending">Pending</option>
            <option value="accepted">Diterima</option>
            <option value="completed">Selesai</option>
            <option value="dibatalkan">Dibatalkan</option>
          </select>
        </div>

        <table className="w-full bg-white border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-2 py-1">Pelanggan</th>
              <th className="px-2 py-1">Alamat Tujuan</th>
              <th className="px-2 py-1">Total</th>
              <th className="px-2 py-1">Status</th>
              <th className="px-2 py-1">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="text-center border-t">
                <td className="px-2 py-1">{order.guestName || '-'}</td>
                <td className="px-2 py-1">{order.deliveryAddress || '-'}</td>
                <td className="px-2 py-1">Rp {order.totalAmount?.toLocaleString()}</td>
                <td className="px-2 py-1 capitalize">{order.status}</td>
                <td className="px-2 py-1">{new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-gray-500 italic text-center">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
