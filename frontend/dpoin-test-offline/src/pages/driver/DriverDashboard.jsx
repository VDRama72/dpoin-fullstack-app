// ✅ FILE: src/pages/driver/DriverDashboard.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import useTitle from '../../hooks/useTitle';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000'); // ganti jika backend beda host

export default function DriverDashboardFinal() {
  useTitle('Dashboard Driver - D’PoIN');
  const navigate = useNavigate();

  const [pendingOrders, setPendingOrders] = useState([]);
  const [history, setHistory] = useState([]);

  const token = localStorage.getItem('token');
  const driverId = localStorage.getItem('userId');

  useEffect(() => {
    fetchOrders();

    if (driverId) {
      socket.emit('register_driver', driverId);
    }

    socket.on('new_order', (order) => {
      setPendingOrders((prev) => [order, ...prev]);
    });

    return () => {
      socket.off('new_order');
    };
  }, [driverId]);

  const fetchOrders = async () => {
    try {
      const allOrders = await api.get('/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const pending = allOrders.data.filter(order => order.status === 'pending');
      const myHistory = allOrders.data.filter(order => order.driverId === driverId);

      setPendingOrders(pending);
      setHistory(myHistory);
    } catch (err) {
      console.error('Gagal memuat data order:', err);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await api.post(`/orders/accept/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch (err) {
      console.error('Gagal menerima order:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-700 mb-6">Dashboard Driver</h1>

        {/* Orderan Menunggu */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-3">Orderan Menunggu</h2>
          {pendingOrders.length === 0 ? (
            <p className="text-gray-500">Tidak ada orderan menunggu.</p>
          ) : (
            <ul className="space-y-4">
              {pendingOrders.map(order => (
                <li key={order._id} className="border p-4 rounded-md">
                  <p><strong>Alamat Jemput:</strong> {order.pickupAddress}</p>
                  <p><strong>Tujuan:</strong> {order.deliveryAddress}</p>
                  <p><strong>Jumlah Item:</strong> {order.items.length}</p>
                  <button
                    onClick={() => handleAcceptOrder(order._id)}
                    className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    Terima Order
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Riwayat */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">Riwayat Order Saya</h2>
          {history.length === 0 ? (
            <p className="text-gray-500">Belum ada riwayat order.</p>
          ) : (
            <ul className="space-y-4">
              {history.map(order => (
                <li key={order._id} className="border p-4 rounded-md">
                  <p><strong>Alamat Jemput:</strong> {order.pickupAddress}</p>
                  <p><strong>Tujuan:</strong> {order.deliveryAddress}</p>
                  <p><strong>Status:</strong> <span className="font-medium text-blue-600">{order.status}</span></p>
                  <button
                    onClick={() => navigate(`/driver/order/${order._id}`)}
                    className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                  >
                    Detail & Chat
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
