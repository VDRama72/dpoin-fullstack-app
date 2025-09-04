// ✅ FILE: src/pages/public/Etalase.jsx (FINAL DENGAN GRID + PAGINATION)

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import useTitle from '../../hooks/useTitle';
import FoodCard from '../../components/public/FoodCard';

export default function Etalase() {
  useTitle('Etalase • D’PoIN');
  const { storeIdentifier } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUnfinishedOrderId, setLastUnfinishedOrderId] = useState(null);
  const [lastUnfinishedOrderStatus, setLastUnfinishedOrderStatus] = useState(null);
  const [checkingLastOrder, setCheckingLastOrder] = useState(true);

  // ✅ REVISI: Tambah state untuk filter kategori
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  // ✅ REVISI: Gabungkan semua kategori + urut abjad
  const categories = [
    'Semua',
    'Buah-buahan',
    'Cemilan',
    'Electric and Digital',
    'Fashion',
    'Kosmetika',
    'Makanan',
    'Minuman',
    'Sayuran',
    'Snack'
  ];

  // --- Efek untuk memeriksa dan memuat produk ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        let url = '/products';
        if (storeIdentifier) {
          url = `/products?storeName=${encodeURIComponent(storeIdentifier)}`;
        }
        const res = await api.get(url);
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error("Etalase: Gagal mengambil produk:", err);
        if (err.response) {
          const errorMessage = err.response.data.message || JSON.stringify(err.response.data);
          setError(`Gagal memuat produk: Server merespons dengan status ${err.response.status}. Pesan: ${errorMessage}`);
        } else if (err.request) {
          setError('Gagal memuat produk: Tidak dapat terhubung ke server. Periksa koneksi internet atau status backend.');
        } else {
          setError(`Gagal memuat produk: Terjadi kesalahan. Pesan: ${err.message}`);
        }
      }
    };
    fetchProducts();
  }, [storeIdentifier]);

  // --- Efek untuk memeriksa order publik terakhir yang belum selesai ---
  useEffect(() => {
    const checkLastPublicOrder = async () => {
      setCheckingLastOrder(true);
      const storedOrderId = localStorage.getItem('dpoi_last_public_order_id');

      if (storedOrderId) {
        try {
          const res = await api.get(`/orders/${storedOrderId}`);
          const orderData = res.data.order || res.data;
          const finalStatuses = ['completed', 'cancelled', 'returned'];

          if (orderData && !finalStatuses.includes(orderData.status)) {
            setLastUnfinishedOrderId(storedOrderId);
            setLastUnfinishedOrderStatus(orderData.status);
          } else {
            localStorage.removeItem('dpoi_last_public_order_id');
            localStorage.removeItem('dpoi_last_public_order_phone');
          }
        } catch (err) {
          console.error("Etalase: Gagal memeriksa status order terakhir:", err);
          if (err.response) {
            if (err.response.status === 404) {
              localStorage.removeItem('dpoi_last_public_order_id');
              localStorage.removeItem('dpoi_last_public_order_phone');
            } else {
              const errorMessage = err.response.data.message || JSON.stringify(err.response.data);
              setError(`Gagal memuat status pesanan terakhir: Server merespons dengan status ${err.response.status}. Pesan: ${errorMessage}`);
            }
          } else if (err.request) {
            setError('Gagal memuat status pesanan terakhir: Tidak dapat terhubung ke server.');
          } else {
            setError(`Gagal memuat status pesanan terakhir: Terjadi kesalahan. Pesan: ${err.message}`);
          }
        } finally {
          setCheckingLastOrder(false);
        }
      } else {
        setCheckingLastOrder(false);
      }
    };

    checkLastPublicOrder();
  }, []);

  // ✅ REVISI: Filter produk berdasarkan pencarian DAN kategori
  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === 'Semua' ||
      (p.category && p.category.toLowerCase() === categoryFilter.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  // ✅ REVISI: Pagination (4 produk per halaman)
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filtered.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filtered.length / productsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading || checkingLastOrder) {
    return <div className="p-4 text-gray-600">Memuat {storeIdentifier ? 'produk toko' : 'etalase'}...</div>;
  }
  if (error) {
    return <div className="p-4 text-red-500 font-semibold">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg md:text-xl font-bold text-indigo-700">D’PoIN Etalase</h1>
          <Link
            to="/login"
            className="px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-indigo-500 text-white text-center py-6 px-4">
        <h2 className="text-xl font-bold mb-1">Selamat Datang di D’PoIN</h2>
        <p className="text-sm max-w-md mx-auto">
          Solusi pelayanan online warga Dompu – cepat, mudah, dan terpercaya!
        </p>
      </section>

      {/* Layanan Utama */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Layanan Utama</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <Link to="/dpoi-car" className="flex flex-col items-center p-3 bg-white rounded-xl shadow hover:shadow-md transition">
            <img src="/car-icon.png" alt="Car" className="w-10 h-10 mb-2" />
            <span className="text-xs font-semibold text-gray-700">D’PoIN Car</span>
          </Link>
          <Link to="/dpoi-store" className="flex flex-col items-center p-3 bg-white rounded-xl shadow hover:shadow-md transition">
            <img src="/store-icon.png" alt="Store" className="w-10 h-10 mb-2" />
            <span className="text-xs font-semibold text-gray-700">D’PoIN Store</span>
          </Link>
          <Link to="/dpoi-food" className="flex flex-col items-center p-3 bg-white rounded-xl shadow hover:shadow-md transition">
            <img src="/food-icon.png" alt="Food" className="w-10 h-10 mb-2" />
            <span className="text-xs font-semibold text-gray-700">D’PoIN Food</span>
          </Link>
        </div>
      </section>

      {/* Banner / Lanjutkan Pesanan */}
      {lastUnfinishedOrderId && (
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-semibold text-sm sm:text-base">
                Anda memiliki pesanan terakhir yang belum selesai! (Status: {lastUnfinishedOrderStatus || 'Menunggu'})
              </p>
            </div>
            <button
              onClick={() => navigate(`/order-success/${lastUnfinishedOrderId}`)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base w-full sm:w-auto"
            >
              Lanjutkan Pesanan
            </button>
          </div>
        </div>
      )}

      {/* Produk */}
      <section className="max-w-6xl mx-auto px-4 pb-6">
        <div className="mb-4 flex flex-col sm:flex-row gap-3 items-center">
          <input
            type="text"
            placeholder="🔍 Cari produk, makanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* ✅ REVISI: Kategori Produk jadi ComboBox */}
        <div className="mb-6">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded-md px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {currentProducts.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Maaf, produk tidak ditemukan.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {currentProducts.map(prod => (
                <div key={prod._id}>
                  <FoodCard food={prod} onAddToCart={() => {}} />
                </div>
              ))}
            </div>

            {/* ✅ Pagination Control */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Ajakan Bergabung */}
      <section className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h2 className="text-base font-bold text-gray-700 mb-2">Ingin Bergabung?</h2>
          <p className="text-sm text-gray-500 mb-4">Daftarkan dirimu sebagai Penjual di D’PoIN</p>
          <Link
            to="/seller/disclaimer"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold"
          >
            🛍️ Daftar Penjual
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-center py-4 border-t text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} D’PoIN. All rights reserved.
      </footer>
    </div>
  );
}
