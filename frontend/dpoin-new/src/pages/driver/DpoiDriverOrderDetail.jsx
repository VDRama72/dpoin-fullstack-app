// ✅ FILE: src/pages/driver/DpoiDriverOrderDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import ChatBox from '../../components/ChatBox'; 

export default function DpoiDriverOrderDetail() {
  const { id: orderId } = useParams(); 
  const [order, setOrder] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(true); 

  const driverId = localStorage.getItem('userId'); 
  const driverName = localStorage.getItem('userName') || localStorage.getItem('driverName'); 

  useEffect(() => {
    console.log("DpoiDriverOrderDetail: useEffect running for orderId:", orderId); 

    const fetchOrder = async () => { 
        try {
            setLoadingOrder(true);
            console.log("DpoiDriverOrderDetail: Fetching order details for:", orderId); 
            const res = await api.get(`/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            }); 
            console.log("DpoiDriverOrderDetail: API response (order data):", res.data); 
            setOrder(res.data.order || res.data); 
            setLoadingOrder(false);
            console.log("DpoiDriverOrderDetail: Order data loaded successfully."); 
        } catch (err) {
            setNotFound(true);
            setLoadingOrder(false);
            console.error('DpoiDriverOrderDetail: Failed to fetch order:', err.response?.data || err.message); 
        }
    };
    if (orderId) { 
        fetchOrder();
    } else {
        setNotFound(true); 
        setLoadingOrder(false);
        console.error("DpoiDriverOrderDetail: No orderId in URL.");
    }
  }, [orderId]); 

  const handleUpdateOrderStatus = async (status) => {
    try {
      // ✅ KOREKSI URL DI SINI: Hapus '/status' dari URL
      const res = await api.put(`/orders/${orderId}`, { status }, { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOrder(res.data.order || res.data); 
      alert(`Status order diperbarui menjadi ${status}!`);
    } catch (err) {
      console.error('Gagal memperbarui status order:', err.response?.data || err.message);
      alert(`Gagal memperbarui status order: ${err.response?.data?.message || 'Terjadi kesalahan.'}`);
    }
  };

  if (notFound) {
    return (
      <div className="p-4 max-w-2xl mx-auto text-center text-gray-600">
        ❌ Order tidak ditemukan atau sudah dihapus.
        <div className="mt-4">
          <Link to="/dashboard/driver" className="text-blue-600 underline">← Kembali</Link>
        </div>
      </div>
    );
  }

  if (loadingOrder || !order) return <div className="p-4">Memuat...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white shadow-lg rounded-lg mt-8">
      <h1 className="text-2xl font-bold mb-4">📦 Detail Order #{order._id}</h1> 
      <div className="mb-4">
        <p><strong>Alamat Jemput:</strong> {order.pickupAddress}</p>
        <p><strong>Tujuan:</strong> {order.deliveryAddress}</p>
        <p><strong>Status:</strong> <span className="font-semibold text-blue-700">{order.status}</span></p> 
        <p><strong>Pelanggan:</strong> {order.guestName || order.customerName} ({order.guestPhone || order.phone})</p>
        <p><strong>Total:</strong> Rp {order.totalAmount?.toLocaleString('id-ID')}</p>
      </div>

      {/* Tombol aksi status untuk Driver */}
      <div className="mt-4 space-x-2 flex flex-wrap gap-2"> 
        {order.status === 'pending' && (
          <button onClick={() => handleUpdateOrderStatus('accepted')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Terima Order</button>
        )}
        {(order.status === 'accepted' || order.status === 'driver_confirmed') && ( 
          <button onClick={() => handleUpdateOrderStatus('on_delivery')} className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">Mulai Pengiriman</button>
        )}
        {order.status === 'on_delivery' && (
          <button onClick={() => handleUpdateOrderStatus('delivered')} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Barang Sampai</button>
        )}
        {(order.status === 'delivered' || order.status === 'paid_by_customer') && (
          <button onClick={() => handleUpdateOrderStatus('completed')} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">Selesaikan Order</button>
        )}
      </div>

      {/* Integrasi komponen ChatBox */}
      <div className="border-t pt-4 mt-6"> 
        <ChatBox orderId={orderId} senderRole="driver" /> 
      </div>

      <div className="mt-6">
        <Link to="/dashboard/driver" className="text-blue-600 underline">← Kembali ke daftar order</Link>
        {/* <button onClick={() => navigate('/dashboard/driver')} className="text-blue-600 underline">← Kembali ke daftar order</button> */}
      </div>
    </div>
  );
}