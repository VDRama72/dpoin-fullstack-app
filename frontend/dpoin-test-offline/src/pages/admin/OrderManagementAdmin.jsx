// ✅ FILE: src/pages/admin/OrderManagementAdmin.jsx

import React, { useEffect, useState } from 'react';
import useTitle from '../../hooks/useTitle';
import axios from 'axios';

export default function OrderManagementAdmin() {
  useTitle('🧾 Manajemen Pesanan - D’PoIN Admin');

  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Gagal ambil pesanan:', err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      if (newStatus === 'dibatalkan') {
        await axios.delete(`http://localhost:4000/api/orders/${id}`);
      } else {
        await axios.put(`http://localhost:4000/api/orders/${id}`, { status: newStatus });
      }
      fetchOrders();
    } catch (err) {
      console.error('Gagal update status:', err);
    }
  };

  const filteredOrders = filter
    ? orders.filter((order) => order.status === filter)
    : orders;

  const statusLabel = {
    pending: 'Menunggu',
    accepted: 'Diproses',
    on_delivery: 'Dikirim',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🧾 Manajemen Pesanan</h2>

      <div className="mb-4 flex items-center gap-2">
        <label>Status:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="">Semua</option>
          <option value="pending">Menunggu</option>
          <option value="accepted">Diproses</option>
          <option value="on_delivery">Dikirim</option>
          <option value="completed">Selesai</option>
          <option value="cancelled">Dibatalkan</option>
        </select>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-3 py-2">No</th>
              <th className="px-3 py-2">Pemesan</th>
              <th className="px-3 py-2">Produk</th>
              <th className="px-3 py-2">Jumlah</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, idx) => (
              <tr key={order._id} className="border-t">
                <td className="px-3 py-2">{idx + 1}</td>
                <td className="px-3 py-2">
                  {order.guestName || (order.userId?.name ?? '-')}
                </td>
                <td className="px-3 py-2">
                  {order.items.map(item => item.name).join(', ')}
                </td>
                <td className="px-3 py-2">
                  {order.items.reduce((sum, item) => sum + item.qty, 0)}
                </td>
                <td className="px-3 py-2">
                  Rp {order.totalAmount?.toLocaleString('id-ID')}
                </td>
                <td className="px-3 py-2 capitalize">
                  {statusLabel[order.status] || order.status}
                </td>
                <td className="px-3 py-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="pending">Menunggu</option>
                    <option value="accepted">Diproses</option>
                    <option value="on_delivery">Dikirim</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                  </select>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-400 italic">Tidak ada pesanan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
