// ✅ FILE: src/pages/public/OrderStatusPage.jsx

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import useTitle from '../../hooks/useTitle';
import {
    FaUserCircle, FaPhoneAlt, FaMotorcycle, FaBoxOpen, FaCheckCircle,
    FaMoneyBillWave, FaTimesCircle, FaCommentDots, FaChevronUp, FaChevronDown,
    FaStore
} from 'react-icons/fa';
import socket from '../../services/socket';
import ChatBox from '../../components/ChatBox';

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
    const [showSummary, setShowSummary] = useState(true);

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
                {/* ✅ TOMBOL KEMBALI KE ETALASE DI DALAM BLOK INI */}
                {['completed', 'cancelled', 'returned'].includes(status) && (
                    <button
                        onClick={() => navigate('/')}
                        className="ml-auto bg-blue-500 text-white font-semibold text-xs py-1 px-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Kembali ke Etalase
                    </button>
                )}
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
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 pb-20">
            <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h1 className="text-2xl font-bold text-gray-800">Status Pesanan</h1>
                        <span className="text-xs font-semibold text-gray-500">#{order._id.substring(18)}</span>
                    </div>

                    <div className="space-y-4">
                        {renderOrderStatus(order.status)}
                    </div>
                    
                    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Detail Driver</h2>
                        {order.driverId ? (
                            <div className="mt-2 flex items-center gap-2">
                                <FaUserCircle className="text-blue-500 text-2xl" />
                                <div>
                                    <p className="font-semibold">{order.driverName || 'Driver'}</p>
                                    {order.driverPhone && (
                                        <a
                                            href={`https://wa.me/${order.driverPhone}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline flex items-center gap-1"
                                        >
                                            <FaPhoneAlt /> Hubungi Driver
                                        </a>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 mt-2">Menunggu driver mengambil pesanan...</p>
                        )}
                    </div>

                    <div className="mt-6 border rounded-lg overflow-hidden">
                        <div
                            className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer"
                            onClick={() => setShowSummary(!showSummary)}
                        >
                            <h2 className="text-lg font-semibold text-gray-700">Ringkasan Pesanan</h2>
                            {showSummary ? <FaChevronUp /> : <FaChevronDown />}
                        </div>

                        {showSummary && (
                            <div className="p-4 bg-white border-t space-y-3">
                                <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                                    <FaStore className="text-purple-600" />
                                    <p className="text-sm font-semibold text-gray-800">
                                        Dari: {order.items[0]?.storeName || 'Tidak diketahui'}
                                    </p>
                                </div>
                                <ul className="space-y-2">
                                    {order.items.map((item, index) => (
                                        <li key={index} className="flex justify-between items-center text-sm text-gray-600 border-b pb-1 last:border-b-0">
                                            <span>{item.productName} ({item.quantity})</span>
                                            <span>Rp {(item.productPrice * item.quantity).toLocaleString('id-ID')}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-300 space-y-1">
                                    <div className="flex justify-between text-sm font-medium text-gray-700">
                                        <span>Subtotal:</span>
                                        <span>Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-medium text-gray-700">
                                        <span>Ongkos Kirim:</span>
                                        <span>Rp {order.shippingCost.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-blue-700 mt-2">
                                        <span>Total Keseluruhan:</span>
                                        <span>Rp {order.grandTotal.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {order.status === 'delivered' && (
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-gray-700">Konfirmasi Pembayaran</h2>
                            <div className="mt-4 space-y-3">
                                <p className="text-sm text-gray-600">Pilih metode pembayaran yang digunakan:</p>
                                <button
                                    onClick={() => handleUserConfirmPayment('cod')}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 p-3 bg-green-500 text-white rounded-lg font-semibold shadow-md hover:bg-green-600 transition-colors disabled:opacity-50"
                                >
                                    <FaMoneyBillWave /> Bayar Cash ke Driver
                                </button>
                                <button
                                    onClick={() => handleUserConfirmPayment('non-cash')}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 p-3 bg-blue-500 text-white rounded-lg font-semibold shadow-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                                >
                                    <FaMoneyBillWave /> Bayar Non-Cash (QRIS, Transfer)
                                </button>
                            </div>
                            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                        </div>
                    )}
                </div>
            </div>

            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => setShowChatbox(!showChatbox)}
                    className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                >
                    <FaCommentDots className="text-2xl" />
                </button>
            </div>

            {showChatbox && order && (
                <div className="fixed bottom-20 right-4 w-72 h-96 bg-white rounded-lg shadow-xl flex flex-col">
                    <div className="p-3 bg-blue-600 text-white font-semibold rounded-t-lg flex justify-between items-center">
                        <p>Chat dengan Driver</p>
                        <button onClick={() => setShowChatbox(false)} className="text-white">
                            <FaTimesCircle />
                        </button>
                    </div>
                    <ChatBox 
                        user={{ id: myId, name: myName }} 
                        driver={{ id: order.driverId, name: order.driverName }} 
                        orderId={orderId} 
                    />
                </div>
            )}
        </div>
    );
}

export default OrderStatusPage;