// src/pages/public/DpoiFood.jsx (versi fix dengan pengecekan status yang benar)

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import useTitle from '../../hooks/useTitle';
import FoodCard from '../../components/public/FoodCard';

export default function DpoiFood() {
  useTitle("D'PoIN Food");

  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('semua');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(true);

  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestAddress, setGuestAddress] = useState('');

  useEffect(() => {
    async function loadFoods() {
      try {
        const res = await api.get('/products');
        setFoods(res.data);
      } catch (err) {
        console.error('Gagal mengambil data makanan:', err);
      }
    }
    loadFoods();
  }, []);

  useEffect(() => {
    const checkGuestOrder = async () => {
      const phone = localStorage.getItem('guestPhone');
      if (!phone) return;

      try {
        const res = await api.get(`/orders/guest/${phone}`);
        const activeOrder = res.data.find(order =>
          !['completed', 'dibatalkan', 'cancelled'].includes(order.status)
        );

        if (activeOrder) {
          const confirmGo = window.confirm('⚠️ Anda memiliki pesanan yang belum selesai. Lihat pesanan?');
          if (confirmGo) {
            navigate(`/dpoi-orders/${activeOrder._id}`);
          } else {
            localStorage.removeItem('lastGuestOrderId');
          }
        }
      } catch (err) {
        console.error('Gagal mengecek pesanan tamu:', err);
      }
    };

    checkGuestOrder();
  }, []);

  const addToCart = (item) => {
    const exists = cart.find(c => c._id === item._id);
    if (exists) {
      setCart(cart.map(c => c._id === item._id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
    if (!showCart) setShowCart(true);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(c => c._id !== id));
  };

  const cancelCheckout = () => {
    setShowCart(false);
  };

  const handleCheckout = async () => {
    try {
      const userId = localStorage.getItem('userId') || null;

      if (!userId) {
        if (!guestName.trim() || !guestPhone.trim() || !guestAddress.trim()) {
          alert('Harap isi nama, nomor HP, dan alamat pengantaran.');
          return;
        }
      }

      const totalAmount = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
      const items = cart.map(item => ({
        productId: item._id,
        name: item.name,
        qty: item.qty,
        price: item.price
      }));

      const deliveryAddress = userId ? 'Alamat user' : guestAddress.trim();
      const pickupAddress = 'Warung Dompu';

      const response = await api.post('/orders', {
        userId,
        guestName: userId ? null : guestName.trim(),
        guestPhone: userId ? null : guestPhone.trim(),
        guestAddress: userId ? null : guestAddress.trim(),
        pickupAddress,
        deliveryAddress,
        items,
        totalAmount
      });

      const orderId = response.data.order._id;
      if (!userId) {
        localStorage.setItem('lastGuestOrderId', orderId);
        localStorage.setItem('guestPhone', guestPhone.trim());
      }

      alert('✅ Pesanan berhasil dikirim!');
      setCart([]);
      setShowCart(false);
      setGuestName('');
      setGuestPhone('');
      setGuestAddress('');
      navigate(`/dpoi-orders/${orderId}`);
    } catch (err) {
      console.error('❌ Gagal checkout:', err);
      alert('Gagal checkout. Silakan coba lagi.');
    }
  };

  const filteredFoods = foods.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === 'semua' || f.category === category)
  );

  const categories = ['semua', 'nasi', 'mie', 'minuman', 'camilan'];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white text-indigo-700 py-3 px-4 flex justify-between items-center sticky top-0 z-50 shadow">
  <div className="flex items-center gap-2">
    <Link to="/" className="text-base flex items-center gap-1">
      <span>🏠</span>
      <span className="font-semibold">Etalase</span>
    </Link>
    <h1 className="text-base font-bold ml-2">🍱 D'PoIN Food</h1>
  </div>
  <Link to="/login" className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition">
    Login
  </Link>
</header>

      <section className="text-center py-6 bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-500 text-white">
        <h2 className="text-3xl font-bold mb-2">Lapar? Tenang, Ada D’PoIN Food</h2>
        <p className="text-sm">Temukan makanan terenak dari warung Dompu, siap antar ke tempatmu!</p>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm border transition ${
                category === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-indigo-600 border-indigo-600 hover:bg-indigo-100'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="mb-6 text-center">
          <input
            type="text"
            placeholder="Cari makanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-full px-4 py-2 text-sm shadow-sm w-full max-w-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {filteredFoods.length === 0 ? (
          <p className="text-center text-gray-500">Tidak ada makanan ditemukan.</p>
        ) : (
          <div className="flex flex-wrap gap-3 justify-center px-1">
            {filteredFoods.map(food => (
              <FoodCard key={food._id} food={food} onAddToCart={() => addToCart(food)} />
            ))}
          </div>
        )}

        {showCart && cart.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-white shadow-xl rounded-xl border border-gray-200 p-5 w-80 max-w-full z-50 overflow-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-xl">🛒 Keranjang</h3>
              <button onClick={cancelCheckout} className="text-indigo-600 font-semibold hover:text-indigo-800">✕</button>
            </div>
            <ul className="divide-y divide-gray-200 max-h-48 overflow-y-auto mb-4">
              {cart.map(item => (
                <li key={item._id} className="flex justify-between py-2 items-center">
                  <span className="truncate max-w-[60%]">{item.name} x{item.qty}</span>
                  <span className="font-semibold">Rp {(item.qty * item.price).toLocaleString('id-ID')}</span>
                  <button onClick={() => removeFromCart(item._id)} className="ml-3 text-sm text-indigo-500 hover:text-indigo-700">✕</button>
                </li>
              ))}
            </ul>

            {!localStorage.getItem('userId') && (
              <div className="mb-4 space-y-2">
                <input type="text" placeholder="Nama Lengkap" value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full p-2 border rounded" />
                <input type="text" placeholder="Nomor HP" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} className="w-full p-2 border rounded" />
                <textarea placeholder="Alamat Pengantaran" value={guestAddress} onChange={(e) => setGuestAddress(e.target.value)} className="w-full p-2 border rounded" rows={3} />
              </div>
            )}

            <div className="mt-4 font-extrabold text-right text-lg">
              Total: Rp {cart.reduce((sum, item) => sum + item.qty * item.price, 0).toLocaleString('id-ID')}
            </div>

            <button onClick={handleCheckout} className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
              Checkout
            </button>
          </div>
        )}
      </div>

      <footer className="bg-indigo-100 text-center py-5 mt-12 text-sm text-indigo-600 font-medium">
        © {new Date().getFullYear()} D'PoIN Food
      </footer>
    </div>
  );
}
