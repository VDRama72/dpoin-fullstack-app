// src/pages/dashboards/DashboardDriver.jsx

import React, { useEffect, useState } from 'react';
import useTitle from '../../hooks/useTitle';
import api from '../../services/api';

export default function DashboardDriver() {
  useTitle('Dashboard Driver - D’PoIN');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders'); // hanya admin bisa akses semua, driver sebaiknya punya endpoint /orders/pending
      const pending = res.data.filter(order => order.status === 'pending');
      setOrders(pending);
    } catch (err) {
      console.error('❌ Gagal ambil data order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await api.post(`/orders/accept/${orderId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchOrders(); // refresh list setelah ambil
    } catch (err) {
      console.error('❌ Gagal ambil order:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-yellow-700 mb-4">Dashboard Driver</h1>
        <p className="text-gray-700 mb-6">Daftar order yang menunggu untuk diantar:</p>

        {loading ? (
          <p className="text-gray-500">Memuat data...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">Tidak ada orderan baru saat ini.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map(order => (
              <li key={order._id} className="border p-4 rounded-md shadow-sm bg-gray-50">
                <div className="mb-2">
                  <strong>Nama:</strong> {order.guestName}<br />
                  <strong>Telepon:</strong> {order.guestPhone}<br />
                  <strong>Alamat Antar:</strong> {order.deliveryAddress}
                </div>
                <button
                  onClick={() => handleAccept(order._id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                  Ambil Order Ini
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
