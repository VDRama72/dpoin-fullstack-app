// ✅ FILE: src/pages/seller/SellerDashboard.jsx (VERSI AKHIR)

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useTitle from '../../hooks/useTitle';
import api from '../../services/api';
import { ShoppingBag, ClipboardList, Wallet } from 'lucide-react';

export default function SellerDashboard() {
  useTitle('Dashboard Penjual • D’PoIN');

  const userName = localStorage.getItem('userName') || 'Penjual';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const resProducts = await api.get('/products/seller');
        setProducts(resProducts.data);
      } catch (err) {
        console.error('❌ Gagal mengambil data dashboard seller:', err);
        setError('Gagal memuat data. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">
          Halo, {userName}! 👋
        </h1>

        <div className="bg-white p-6 rounded-lg shadow mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-between">
            <span>Daftar Produk Saya</span>
            <Link to="/seller/products" className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-full font-semibold hover:bg-indigo-700 transition">
              Kelola Produk
            </Link>
          </h2>

          {loading && <p className="text-center text-gray-500">Memuat produk...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && !error && products.length === 0 && (
            <p className="text-center text-gray-500">Belum ada produk yang ditambahkan.</p>
          )}
          {!loading && !error && products.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-700 border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Gambar</th>
                    <th className="px-4 py-2 text-left">Nama</th>
                    <th className="px-4 py-2 text-left">Harga</th>
                    <th className="px-4 py-2 text-left">Stok</th>
                    <th className="px-4 py-2 text-left">Kategori</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(prod => (
                    <tr key={prod._id} className="border-t">
                      <td className="px-4 py-2">
                        {prod.image ? (
                          // ✅ PERBAIKAN DI SINI: tambahkan '/' di antara baseUrl dan prod.image
                         <img src={`${baseUrl}${prod.image}`} alt={prod.name} className="w-16 h-16 object-cover rounded" />
                        ) : (
                          <span className="text-gray-400 italic">Tidak ada</span>
                        )}
                      </td>
                      <td className="px-4 py-2">{prod.name}</td>
                      <td className="px-4 py-2">Rp {prod.price.toLocaleString()}</td>
                      <td className="px-4 py-2">{prod.stock}</td>
                      <td className="px-4 py-2 capitalize">{prod.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}