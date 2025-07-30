// ✅ FILE: src/pages/public/OrderStatusPage.jsx

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import useTitle from '../../hooks/useTitle';
import {
  FaUserCircle, FaPhoneAlt, FaMotorcycle, FaBoxOpen, FaCheckCircle,
  FaMoneyBillWave, FaTimesCircle, FaCommentDots, FaChevronUp, FaChevronDown
} from 'react-icons/fa';
import socket from '../../services/socket';
import ChatBox from '../../components/ChatBox'; 

const api = axios.create({
  baseURL: 'http://localhost:4000/api', 
});

const calculateDummyShippingCost = (distanceKm) => {
  return distanceKm <= 5 ? 10000 : 10000 + (Math.ceil(distanceKm - 5) * 500);
};

function OrderStatusPage() {
  useTitle('Status Pesanan Anda');
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentOption, setPaymentOption] = useState('');
  const [showChatbox, setShowChatbox] = useState(true);
  const [showSummary, setShowSummary] = useState(true); // ✅ Toggle Ringkasan Order

  const myId = localStorage.getItem('userId');
  const myName = localStorage.getItem('userName') || 'Anda';

  useEffect(() => {
    const newSocket = socket;

    newSocket.off('orderUpdate');
    newSocket.on('orderUpdate', (updatedOrder) => {
      setOrder(updatedOrder);
      if (updatedOrder && ['completed', 'cancelled', 'returned'].includes(updatedOrder.status)) {
        localStorage.removeItem('dpoi_last_public_order_id');
        localStorage.removeItem('dpoi_last_public_order_phone');
      }
    });

    newSocket.emit('joinOrderRoom', orderId);

    return () => {
      newSocket.emit('leaveOrderRoom', orderId);
      newSocket.off('orderUpdate');
    };
  }, [orderId]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${orderId}`);
        const fetchedOrder = res.data.order || res.data;
        const dummyDistance = 7;
        const baseTotalAmount = Number(fetchedOrder.totalAmount);
        const calculatedShippingCost = fetchedOrder.shippingCost || calculateDummyShippingCost(dummyDistance);
        const orderWithShipping = {
          ...fetchedOrder,
          shippingCost: Number(calculatedShippingCost),
          grandTotal: baseTotalAmount + Number(calculatedShippingCost)
        };
        setOrder(orderWithShipping);
        setLoading(false);

        if (['completed', 'cancelled', 'returned'].includes(orderWithShipping.status)) {
          localStorage.removeItem('dpoi_last_public_order_id');
          localStorage.removeItem('dpoi_last_public_order_phone');
        }
      } catch (err) {
        setError(`Gagal memuat detail pesanan: ${err.response?.data?.message || 'Terjadi kesalahan.'}`);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleUserConfirmPayment = async (method) => {
    setError(null);
    if (!order || !method) {
      setError('Metode pembayaran tidak valid.');
      return;
    }

    setPaymentOption(method);

    try {
      setLoading(true);
      const res = await api.put(`/orders/${orderId}`, {
        status: 'paid_by_customer',
        paymentMethod: method,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const updatedOrder = res.data.order || res.data;
      const orderToSet = {
        ...updatedOrder,
        shippingCost: order.shippingCost,
        grandTotal: order.grandTotal
      };
      setOrder(orderToSet);

      if (['completed', 'cancelled', 'returned'].includes(updatedOrder.status)) {
        localStorage.removeItem('dpoi_last_public_order_id');
        localStorage.removeItem('dpoi_last_public_order_phone');
      }

      setLoading(false);

      if (socket && socket.connected) {
        socket.emit('orderStatusChanged', { orderId, newStatus: 'paid_by_customer', updatedOrder: orderToSet });
      }

      alert(`Pembayaran Anda (${method.toUpperCase()}) telah dikonfirmasi!`);
    } catch (err) {
      setError(`Gagal mengkonfirmasi pembayaran: ${err.response?.data?.message || 'Coba lagi.'}`);
      setLoading(false);
    }
  };

  const renderOrderStatus = (status) => {
    let icon, bgColor, textColor, message;
    switch (status) {
      case 'pending':
        icon = <FaBoxOpen className="text-xl" />;
        bgColor = 'bg-yellow-100'; textColor = 'text-yellow-700'; message = 'Menunggu konfirmasi driver...'; break;
      case 'accepted':
      case 'driver_confirmed':
        icon = <FaMotorcycle className="text-xl" />;
        bgColor = 'bg-blue-100'; textColor = 'text-blue-700'; message = `Driver ${order.driverName || 'sedang menuju lokasi'}`; break;
      case 'ready_for_delivery':
        icon = <FaBoxOpen className="text-xl" />;
        bgColor = 'bg-purple-100'; textColor = 'text-purple-700'; message = `Driver ${order.driverName || ''} siap mengirim!`; break;
      case 'on_delivery':
        icon = <FaMotorcycle className="text-xl" />;
        bgColor = 'bg-orange-100'; textColor = 'text-orange-700'; message = `Pesanan sedang diantar oleh ${order.driverName || ''}.`; break;
      case 'delivered':
        icon = <FaCheckCircle className="text-xl" />;
        bgColor = 'bg-green-100'; textColor = 'text-green-700'; message = 'Pesanan telah tiba! Mohon periksa barang Anda.'; break;
      case 'paid_by_customer':
        icon = <FaMoneyBillWave className="text-xl" />;
        bgColor = 'bg-blue-100'; textColor = 'text-blue-700'; message = 'Pembayaran Anda berhasil dikonfirmasi.'; break;
      case 'completed':
        icon = <FaCheckCircle className="text-xl" />;
        bgColor = 'bg-gray-100'; textColor = 'text-gray-700'; message = 'Pesanan Selesai. Terima kasih!'; break;
      case 'cancelled':
        icon = <FaTimesCircle className="text-xl" />;
        bgColor = 'bg-red-100'; textColor = 'text-red-700'; message = 'Pesanan Dibatalkan.'; break;
      default:
        icon = <FaBoxOpen className="text-xl" />;
        bgColor = 'bg-gray-50'; textColor = 'text-gray-600'; message = `Status: ${status}`;
    }
    return (
      <div className={`flex items-center gap-2 p-3 rounded-lg ${bgColor} ${textColor}`}>
        {icon}
        <span className="font-semibold">{message}</span>
      </div>
    );
  };

  if (loading) return <p className="text-center p-6">Memuat...</p>;
  if (error) return <p className="text-center text-red-500 p-6">{error}</p>;
  if (!order) return (
    <div className="text-center mt-20 p-6 text-gray-600 border rounded-lg bg-gray-50">
      <p className="font-bold text-xl mb-2">Pesanan Tidak Ditemukan</p>
      <p>Maaf, detail pesanan dengan ID ini tidak dapat ditemukan.</p>
      <button onClick={() => navigate('/')} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Kembali ke Etalase
      </button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg mt-8">
      <h1 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">
        Status Pesanan #{order._id}
      </h1>

      <div className="mb-6 space-y-3">
        {renderOrderStatus(order.status)}
        <p className="text-gray-700 flex items-center gap-2">
          <FaUserCircle /> Pelanggan: <span className="font-semibold">{order.guestName || order.customerName}</span>
        </p>
        <p className="text-gray-700 flex items-center gap-2">
          <FaPhoneAlt /> Telepon: <span className="font-semibold">{order.guestPhone || order.phone}</span>
        </p>
        <p className="text-gray-700 flex items-center gap-2">
          <FaBoxOpen /> Alamat Pengiriman: <span className="font-semibold">{order.deliveryAddress || order.guestAddress}</span>
        </p>
      </div>

      {(order.driverId || order.driverName) && (order.status !== 'pending' && order.status !== 'cancelled') && (
        <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-bold text-blue-800 mb-3">Informasi Driver</h2>
          <p className="flex items-center gap-2 text-blue-700">
            <FaMotorcycle /> Nama Driver: <span className="font-semibold">{order.driverName || (order.driverId ? order.driverId.name : 'N/A')}</span>
          </p>
          {(order.driverPhone || (order.driverId && order.driverId.phone)) && (
            <p className="flex items-center gap-2 text-blue-700 mt-1">
              <FaPhoneAlt /> Telepon Driver: <span className="font-semibold">{order.driverPhone || (order.driverId ? order.driverId.phone : '-')}</span>
            </p>
          )}
        </div>
      )}

      {(order.status === 'accepted' || order.status === 'driver_confirmed' || order.status === 'on_delivery' || order.status === 'delivered' || order.status === 'paid_by_customer') && (
        <div className="mt-8 p-4 border rounded bg-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><FaCommentDots /> Chat with Driver</h2>
            <button
              onClick={() => setShowChatbox(!showChatbox)}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              {showChatbox ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
          {showChatbox && (
            <ChatBox orderId={orderId} senderRole="customer" />
          )}
        </div>
      )}

      {/* ✅ Ringkasan Order DENGAN TOGGLE & ANTI-NaN */}
      <div className="mt-8 pt-4 border-t-2 border-dashed border-gray-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Ringkasan Order</h2>
          <button
            onClick={() => setShowSummary(!showSummary)}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            {showSummary ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {showSummary && (
          <>
            <ul className="space-y-2 text-left text-gray-700 mb-4">
              {order.items?.map((item, index) => (
                <li key={item.productId || index} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                  <div>
                    <p className="font-semibold">{item.productName}</p>
                    <p className="text-sm">Qty: {item.quantity ?? '-'}</p>
                  </div>
                  <p className="font-bold text-green-700">
                    {typeof item.productPrice === 'number' && typeof item.quantity === 'number'
                      ? `Rp ${(item.productPrice * item.quantity).toLocaleString('id-ID')}`
                      : '-'}
                  </p>
                </li>
              ))}
            </ul>
            <div className="text-right mt-4 font-bold text-xl text-gray-700">
              Total Produk: Rp {typeof order.totalAmount === 'number' ? order.totalAmount.toLocaleString('id-ID') : '-'}
            </div>
            <div className="text-right mt-2 font-bold text-base text-gray-700">
              Biaya Pengiriman: Rp {typeof order.shippingCost === 'number' ? order.shippingCost.toLocaleString('id-ID') : '-'}
            </div>
            <div className="text-right mt-4 font-extrabold text-2xl text-blue-700">
              GRAND TOTAL: Rp {typeof order.grandTotal === 'number' ? order.grandTotal.toLocaleString('id-ID') : '-'}
            </div>
          </>
        )}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
        >
          Kembali ke Etalase
        </button>
      </div>
    </div>
  );
}

export default OrderStatusPage;
