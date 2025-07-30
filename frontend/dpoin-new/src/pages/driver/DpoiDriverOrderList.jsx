// ✅ FILE: src/pages/driver/DpoiDriverOrderList.jsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function DpoiDriverOrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await api.get('/orders');
    const pending = res.data.filter(o => o.status === 'pending');
    setOrders(pending);
  };

  const acceptOrder = async (orderId) => {
    try {
      await api.post(`/orders/accept/${orderId}`);
      toast.success('Order berhasil diambil');
      fetchOrders();
    } catch (err) {
      toast.error('Gagal ambil order');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📦 Daftar Order Masuk</h1>
      <ul className="space-y-3">
        {orders.map(order => (
          <li key={order._id} className="p-4 border rounded bg-white shadow">
            <div>📍 {order.deliveryAddress}</div>
            <div>🧾 Total: Rp {order.totalAmount.toLocaleString('id-ID')}</div>
            <button
              onClick={() => acceptOrder(order._id)}
              className="mt-2 px-4 py-1 bg-green-600 text-white rounded"
            >
              Ambil Order
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

