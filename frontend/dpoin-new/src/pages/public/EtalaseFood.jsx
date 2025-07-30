// ✅ FILE: src/pages/public/EtalaseFood.jsx (Revisi 100% Fix - Tampilkan Semua Produk Dulu)

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useTitle from '../../hooks/useTitle';
import api from '../../services/api';
import FoodCard from '../../components/public/FoodCard';

export default function EtalaseFood() {
  useTitle("D'PoIN Food");

  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('semua');

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/products'); // Ambil semua produk tanpa filter
        console.log("DATA PRODUK:", res.data); // Debug
        setFoods(res.data);
      } catch (err) {
        console.error('Gagal memuat produk:', err);
      }
    }
    load();
  }, []);

  const addToCart = (item) => {
    const exists = cart.find(f => f._id === item._id);
    if (exists) {
      setCart(cart.map(f => f._id === item._id ? { ...f, qty: f.qty + 1 } : f));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  // Filter sementara dimatikan dulu untuk validasi tampil semua
  const filtered = foods;

  const categories = ['semua', 'nasi', 'mie', 'minuman', 'camilan'];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-red-700">D'PoIN Food</h1>
          <Link to="/login" className="text-sm text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700">
            Login
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold text-center mb-4">
          Lapar? Tenang, Ada D’PoIN Food
        </h2>

        <div className="flex justify-center flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full border ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white'
                  : 'text-red-600 border-red-600 hover:bg-red-100'
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari makanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border rounded shadow-sm"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-500">Tidak ada makanan ditemukan.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map(item => (
              <FoodCard key={item._id} food={item} onAdd={() => addToCart(item)} />
            ))}
          </div>
        )}
      </main>

      {cart.length > 0 && (
        <footer className="fixed bottom-0 w-full bg-white border-t shadow-lg p-4 flex justify-between items-center">
          <span className="text-gray-700">🛒 {cart.reduce((a, b) => a + b.qty, 0)} item di keranjang
          </span>
          <Link to="/checkout" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Checkout
          </Link>
        </footer>
      )}
    </div>
  );
}
