// ✅ FILE: src/pages/public/Checkout.jsx (Revisi Final: Kirim Ongkir & Grand Total + Fix Rp NaN)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import useTitle from '../../hooks/useTitle';

// Fungsi dummy untuk hitung ongkir (HARUS SAMA DENGAN OrderStatusPage.jsx DAN BACKEND)
const calculateDummyShippingCost = (distanceKm) => {
    if (distanceKm <= 5) {
        return 10000;
    } else {
        return 10000 + (Math.ceil(distanceKm - 5) * 500);
    }
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

  useEffect(() => {
    const savedCart = localStorage.getItem('dpoi_checkout_temp'); 
    if (savedCart) {
      // ✅ PASTIKAN PRICE DAN QTY ADALAH NUMBER SAAT MEMBACA DARI LOCAL STORAGE
      const parsedCart = JSON.parse(savedCart).map(item => ({
        ...item,
        price: Number(item.price), // KONVERSI KE NUMBER
        qty: Number(item.qty)      // KONVERSI KE NUMBER
      }));
      setCart(parsedCart);
    } else {
      navigate('/orders'); 
    }
  }, [navigate]); 

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // ✅ HITUNG ONGKIR DUMMY DAN GRAND TOTAL SEBELUM SUBMIT
  const dummyDistance = 7; 
  const shippingCost = calculateDummyShippingCost(dummyDistance);
  const grandTotal = totalPrice + shippingCost;


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !address || !phone) {
      setError('Mohon lengkapi nama, alamat, dan nomor telepon.');
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
      items: cart.map(item => ({ // ✅ PASTIKAN QUANTITY, PRODUCTPRICE ADALAH NUMBER SAAT DIKIRIM
        productId: item._id,
        quantity: Number(item.qty), // KONVERSI KE NUMBER
        productName: item.name,      
        productPrice: Number(item.price), // KONVERSI KE NUMBER
        productImage: item.image,
        storeName: item.storeName    
      })),
      totalAmount: Number(totalPrice), // KONVERSI KE NUMBER
      pickupAddress: 'Alamat Penjemputan Default DPOI', 
      deliveryAddress: address, 
      paymentMethod: 'cod',    
      status: 'pending',       
      sellerIds: sellerIds, 
      shippingCost: shippingCost, // KIRIM ONGKIR
      grandTotal: grandTotal,     // KIRIM GRAND TOTAL
    };

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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded mt-10">
      <h1 className="text-2xl font-bold mb-6">Checkout Pesanan</h1>

      {/* TAMPILKAN DAFTAR ITEM DI CART */}
      <div className="mb-6 border rounded p-4 bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">Daftar Produk</h2>
        <ul className="space-y-2">
          {cart.map((item) => (
            <li key={item._id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.qty}</p>
              </div>
              <div className="text-right">
                <p className="text-green-600 font-bold">
                  Rp {(item.price * item.qty).toLocaleString('id-ID')}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="text-right mt-4 font-bold text-lg text-red-600">
          Total: Rp {totalPrice.toLocaleString('id-ID')}
        </div>
      </div>

      {/* FORMULIR PEMESANAN */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Nama Lengkap</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Alamat Lengkap</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Nomor Telepon</label>
          <input
            type="tel"
            className="w-full border px-3 py-2 rounded"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Catatan (opsional)</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700 transition"
        >
          {loading ? 'Memproses...' : 'Konfirmasi Pesanan'}
        </button>
      </form>
    </div>
  );
}