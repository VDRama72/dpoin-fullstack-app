// ✅ FILE: src/pages/public/Checkout.jsx (FINAL DENGAN RUMUS BARU)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import useTitle from '../../hooks/useTitle';
import { FaLocationArrow, FaUser, FaPhone, FaMapMarkerAlt, FaStickyNote, FaCheckCircle, FaExclamationCircle, FaStore } from 'react-icons/fa';

// ✅ FUNGSI DUMMY UNTUK HITUNG ONGKIR (REVISI)
const calculateDummyShippingCost = (distanceKm) => {
    const baseCost = 8000;
    const additionalKm = Math.ceil(Math.max(0, distanceKm - 1));
    return baseCost + (additionalKm * 1000);
};

export default function Checkout() {
    useTitle('Checkout D’PoIN Food');
    const navigate = useNavigate();

    const [cart, setCart] = useState([]);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [isDetecting, setIsDetecting] = useState(false);
    
    // Asumsi: Lokasi penjual untuk perhitungan ongkir
    const sellerLocation = {
        latitude: -8.5393,
        longitude: 118.4716
    };

    useEffect(() => {
        const savedCart = localStorage.getItem('dpoi_checkout_temp');
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart).map(item => ({
                ...item,
                price: Number(item.price),
                qty: Number(item.qty)
            }));
            setCart(parsedCart);
        } else {
            navigate('/orders');
        }
    }, [navigate]);
    
    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation tidak didukung oleh browser Anda.');
            return;
        }

        setIsDetecting(true);
        setLocationError(null);
        setUserLocation(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude });
                setIsDetecting(false);
            },
            (error) => {
                setIsDetecting(false);
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError("Akses lokasi ditolak. Mohon izinkan.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationError("Informasi lokasi tidak tersedia.");
                        break;
                    case error.TIMEOUT:
                        setLocationError("Permintaan deteksi lokasi melebihi waktu.");
                        break;
                    default:
                        setLocationError("Terjadi kesalahan yang tidak diketahui.");
                        break;
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    };

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const distance = (userLocation && sellerLocation) 
        ? 7
        : 0;

    const shippingCost = calculateDummyShippingCost(distance);
    const grandTotal = totalPrice + shippingCost;
    const uniqueSellerNames = [...new Set(cart.map(item => item.storeName))];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!name || !address || !phone || !userLocation) {
            setError('Mohon lengkapi nama, alamat, nomor telepon, dan pastikan posisi Anda sudah terdeteksi.');
            setLoading(false); 
            return;
        }

        setLoading(true);
        setError(null);

        const sellerIds = [...new Set(cart.map(item => item.sellerId || item.seller?._id))];

        const orderData = {
            guestName: name,
            guestPhone: phone,
            guestAddress: address,
            note,
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            items: cart.map(item => ({
                productId: item._id,
                quantity: Number(item.qty),
                productName: item.name,
                productPrice: Number(item.price),
                productImage: item.image,
                storeName: item.storeName
            })),
            totalAmount: Number(totalPrice),
            pickupAddress: 'Alamat Penjemputan Default DPOI',
            deliveryAddress: address,
            paymentMethod: 'cod',
            status: 'pending',
            sellerIds: sellerIds,
            shippingCost: shippingCost,
            grandTotal: grandTotal,
        };

        console.log("Data order yang akan dikirim:", orderData);

        try {
            const res = await api.post('/orders', orderData);

            let currentFullCart = JSON.parse(localStorage.getItem('dpoi_cart')) || [];
            const itemsInCurrentCheckout = JSON.parse(localStorage.getItem('dpoi_checkout_temp')) || [];
            
            const updatedFullCart = currentFullCart.filter(
                (cartItem) => !itemsInCurrentCheckout.some((checkoutItem) => checkoutItem._id === cartItem._id)
            );
            localStorage.setItem('dpoi_cart', JSON.stringify(updatedFullCart));

            localStorage.removeItem('dpoi_checkout_temp');

            localStorage.setItem('dpoi_last_public_order_id', res.data.order._id);
            localStorage.setItem('dpoi_last_public_order_phone', phone);

            navigate(`/order-success/${res.data.order._id}`);
        } catch (err) {
            console.error("Error submitting order:", err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || err.message || 'Terjadi kesalahan saat submit order.';
            setError(`Gagal submit order: ${errorMessage}`);
            setLoading(false);
        }
    };

    if (cart.length === 0)
        return <p className="text-center mt-10">Keranjang kosong. Silakan tambah produk dulu.</p>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 pb-20">
            <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Checkout</h1>
                    
                    <div className="mb-8 p-5 bg-blue-50 rounded-lg border border-blue-200">
                        <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                            <FaCheckCircle className="text-blue-600" /> Ringkasan Pesanan
                        </h2>
                        
                        <div className="flex items-center gap-2 mb-4 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                            <FaStore className="text-purple-600 text-2xl" />
                            <p className="text-base font-semibold text-gray-800">
                                Dibeli dari: {uniqueSellerNames.join(', ')}
                            </p>
                        </div>

                        <ul className="space-y-3 mb-4">
                            {cart.map((item) => (
                                <li key={item._id} className="flex justify-between items-center pb-2 border-b border-blue-100 last:border-b-0">
                                    <div>
                                        <p className="font-medium text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-700">
                                            Rp {(item.price * item.qty).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="pt-4 border-t border-blue-200 space-y-2">
                            <div className="flex justify-between font-semibold text-lg text-gray-800">
                                <span>Subtotal:</span>
                                <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg text-gray-800">
                                <span>Ongkos Kirim:</span>
                                <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between font-extrabold text-2xl text-blue-700 mt-3 pt-3 border-t-2 border-blue-300">
                                <span>Total Keseluruhan:</span>
                                <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FaUser className="text-gray-600" /> Detail Kontak & Pengiriman
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="name" className="mb-1 block font-semibold text-gray-700">Nama Lengkap</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="name"
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pl-10 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder="Masukkan nama lengkap Anda"
                                            required
                                        />
                                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="phone" className="mb-1 block font-semibold text-gray-700">Nomor Telepon (wajib WA) </label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            id="phone"
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pl-10 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            placeholder="Contoh: 081234567890"
                                            required
                                        />
                                        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <label htmlFor="address" className="mb-1 block font-semibold text-gray-700">Alamat Lengkap</label>
                                <div className="relative">
                                    <textarea
                                        id="address"
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pl-10 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        value={address}
                                        onChange={e => setAddress(e.target.value)}
                                        placeholder="Jalan, Nomor Rumah, RT/RW, Kelurahan, Kecamatan"
                                        required
                                        rows="3"
                                    />
                                    <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                                </div>

                                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <button
                                        type="button"
                                        onClick={handleDetectLocation}
                                        disabled={isDetecting}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FaLocationArrow className="h-4 w-4" /> {isDetecting ? 'Mendeteksi posisi...' : 'Deteksi Posisi Saya'}
                                    </button>
                                    <p className="flex-shrink-0 text-sm font-semibold text-red-600">(wajib di klik)</p>
                                </div>
                                {userLocation && (
                                    <p className="mt-2 flex items-center gap-1 text-sm text-green-600">
                                        <FaCheckCircle className="text-green-500" /> Posisi terdeteksi! Latitude: {userLocation.latitude}, Longitude: {userLocation.longitude}
                                    </p>
                                )}
                                {locationError && (
                                    <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
                                        <FaExclamationCircle className="text-red-500" /> {locationError}
                                    </p>
                                )}
                            </div>

                            <div className="mt-4">
                                <label htmlFor="note" className="mb-1 block font-semibold text-gray-700">Catatan (opsional)</label>
                                <div className="relative">
                                    <textarea
                                        id="note"
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pl-10 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        value={note}
                                        onChange={e => setNote(e.target.value)}
                                        placeholder="Contoh: Jangan terlalu pedas, antar jam 5 sore."
                                        rows="2"
                                    />
                                    <FaStickyNote className="absolute left-3 top-3 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {error && <p className="text-red-600 text-center mt-4">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-red-600 px-4 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                        >
                            {loading ? 'Memproses Pesanan...' : 'Konfirmasi Pesanan Saya'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}