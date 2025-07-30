// ✅ FILE: src/pages/driver/DriverDashboardFinal.jsx (Perbaikan Sintaksis Import)

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
// import socket from '../../services/socket'; // Uncomment jika ingin real-time update daftar order

const DriverDashboardFinal = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [driverName, setDriverName] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId'); 

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
      }); 
      const allOrders = res.data.orders || res.data; 

      const filteredForDisplay = allOrders.filter(order =>
        (order.status === 'pending' && !order.driverId) || 
        (order.driverId === userId) 
      );

      setOrders(filteredForDisplay);
    } catch (err) {
      console.error('Gagal mengambil order driver:', err.response?.data || err.message);
    }
  };

  const fetchDriverProfile = async () => {
    try {
      const res = await api.get(`/users/${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
      }); 
      setDriverName(res.data.name);
    } catch (err) {
      console.error('Gagal mengambil data driver:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchDriverProfile();

    // Real-time update untuk daftar order (uncomment jika Socket.IO di frontend sudah aktif)
    // if (socket) {
    //   socket.on('orderUpdate', (updatedOrder) => {
    //     setOrders((prevOrders) => {
    //       const existingOrderIndex = prevOrders.findIndex(o => o._id === updatedOrder._id);
    //       if (existingOrderIndex > -1) {
    //         const newOrders = [...prevOrders];
    //         newOrders[existingOrderIndex] = updatedOrder; 
    //         return newOrders;
    //       } else if ((updatedOrder.status === 'pending' && !updatedOrder.driverId) || updatedOrder.driverId === userId) {
    //         return [...prevOrders, updatedOrder];
    //       }
    //       return prevOrders;
    //     });
    //   });
    //   return () => {
    //     socket.off('orderUpdate');
    //   };
    // }
  }, [userId, token]); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role'); 
    navigate('/login');
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await api.post(`/orders/accept/${orderId}`, { driverId: userId, driverName: driverName }, { 
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders(); 
      alert('Order berhasil diterima!'); 
    } catch (err) {
      console.error('Gagal menerima order:', err.response?.data || err.message);
      alert(`Gagal menerima order: ${err.response?.data?.message || 'Terjadi kesalahan.'}`);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus }, { 
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders(); 
      alert(`Status order diperbarui menjadi ${newStatus}!`); 
    } catch (err) {
      console.error(`Gagal update status ke ${newStatus}:`, err.response?.data || err.message);
      alert(`Gagal update status: ${err.response?.data?.message || 'Terjadi kesalahan.'}`);
    }
  };

  const filteredOrders = statusFilter
    ? orders.filter(order => order.status === statusFilter)
    : orders;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-yellow-700">Dashboard Driver</h2>
        <div className="text-right">
          <p className="font-semibold">👤 {driverName}</p>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm mt-1 hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mb-4 flex justify-start">
        <label className="mr-2">Status:</label>
        <select
          className="border rounded px-2 py-1"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Semua</option>
          <option value="pending">Pending</option>
          <option value="accepted">Diterima</option>
          <option value="on_delivery">Sedang Diantar</option>
          <option value="delivered">Barang Sampai</option>
          <option value="paid_by_customer">Dibayar Pelanggan</option>
          <option value="completed">Selesai</option>
          <option value="cancelled">Dibatalkan</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 && (
          <p className="text-gray-500 italic">Tidak ada pesanan ditemukan.</p>
        )}
        {filteredOrders.map((order) => { 
          let actionButton = null; 

          if (order.status === 'pending' && !order.driverId) {
            actionButton = (
              <button onClick={() => handleAcceptOrder(order._id)} className="bg-blue-700 text-white px-4 py-1 rounded hover:bg-blue-800">
                Terima Order
              </button>
            );
          } else if (order.driverId === userId && order.status === 'accepted') {
            actionButton = (
              <button onClick={() => handleUpdateOrderStatus(order._id, 'on_delivery')} className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600">
                🚚 Mulai Pengiriman
              </button>
            );
          } else if (order.driverId === userId && order.status === 'on_delivery') {
            actionButton = (
              <button onClick={() => handleUpdateOrderStatus(order._id, 'delivered')} className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">
                Barang Sampai
              </button>
            );
          } else if (order.driverId === userId && (order.status === 'delivered' || order.status === 'paid_by_customer')) {
            actionButton = (
              <button onClick={() => handleUpdateOrderStatus(order._id, 'completed')} className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-800">
                ✅ Selesaikan Order
              </button>
            );
          }

          return ( 
            <div key={order._id} className="border p-4 rounded-lg shadow-md bg-white">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Pelanggan:</strong> {order.customerName || order.guestName}</p>
            <p><strong>Alamat Jemput:</strong> {order.pickupAddress}</p>
            <p><strong>Tujuan:</strong> {order.deliveryAddress}</p>
            <p><strong>Status:</strong> <span className="text-blue-700 font-semibold">{order.status}</span></p>
            <div className="mt-2 space-x-2 flex flex-wrap gap-2"> 
                {actionButton} 
              <button onClick={() => navigate(`/driver/order/${order._id}`)} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                Detail & Chat
              </button>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default DriverDashboardFinal;