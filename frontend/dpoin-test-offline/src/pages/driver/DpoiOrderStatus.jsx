// ✅ FILE: src/pages/public/DpoiOrderStatus.jsx (tracking + chat + auto redirect saat selesai)
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import socket from '../../services/socket';

export default function DpoiOrderStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchOrder();
    socket.on(`chat_order_${id}`, (msg) => {
      setChat(prev => [...prev, msg]);
    });

    return () => {
      socket.off(`chat_order_${id}`);
    };
  }, [id]);

  const fetchOrder = async () => {
    const res = await api.get(`/orders/${id}`);
    setOrder(res.data);
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    const msg = { orderId: id, from: 'customer', to: 'driver', message };
    socket.emit('chat_message', msg);
    setChat(prev => [...prev, msg]);
    setMessage('');
  };

  // 🔁 Redirect otomatis jika sudah selesai
  useEffect(() => {
    if (order?.status === 'completed') {
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [order?.status, navigate]);

  if (!order) return <div>Loading...</div>;

  if (order.status === 'completed') {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold text-green-600">✅ Transaksi Selesai</h2>
        <p className="mt-2">Terima kasih telah menggunakan layanan D’PoIN!</p>
        <p className="text-sm mt-4 text-gray-500">Anda akan diarahkan kembali ke halaman utama...</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-2">Status Pesanan</h1>
      <p>Status: <strong>{order.status}</strong></p>
      {order.driverInfo && (
        <p>📦 Diantar oleh: {order.driverInfo.name} ({order.driverInfo.phone})</p>
      )}

      <div className="mt-4 border-t pt-4">
        <h2 className="font-semibold">💬 Chat dengan Driver</h2>
        <div className="border p-2 h-48 overflow-y-auto bg-gray-50 rounded">
          {chat.length === 0 && (
            <p className="text-gray-400 italic">Belum ada pesan.</p>
          )}
          {chat.map((c, i) => (
            <div key={i} className="mb-1">
              <strong>{c.from}:</strong> {c.message}
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            className="border p-1 flex-1 rounded"
            placeholder="Ketik pesan..."
          />
          <button
            onClick={sendMessage}
            className="px-4 py-1 bg-blue-600 text-white rounded"
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
}
