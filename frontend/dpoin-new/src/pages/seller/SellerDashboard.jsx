// ✅ FILE: src/pages/seller/SellerDashboard.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useTitle from '../../hooks/useTitle';
import api from '../../services/api'; // axios instance
import { ShoppingBag, ClipboardList, Wallet } from 'lucide-react';

export default function SellerDashboard() {
  useTitle('Dashboard Penjual • D’PoIN');

  const userName = localStorage.getItem('userName') || 'Penjual';

  const [totalProduk, setTotalProduk] = useState(0);
  const [pesananHariIni, setPesananHariIni] = useState(0);
  const [pendapatanBulanIni, setPendapatanBulanIni] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProduk = await api.get('/seller/products/count');
        const resPesanan = await api.get('/seller/orders/today');
        const resPendapatan = await api.get('/seller/earnings/monthly');

        setTotalProduk(resProduk.data.count || 0);
        setPesananHariIni(resPesanan.data.count || 0);
        setPendapatanBulanIni(resPendapatan.data.total || 0);
      } catch (err) {
        console.error('❌ Gagal mengambil data dashboard seller:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">
          Halo, {userName}! 👋
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Kartu: Total Produk */}
          <div className="bg-white border rounded-2xl shadow-sm p-5 flex items-center gap-4">
            <div className="bg-green-100 text-green-600 p-3 rounded-full">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Produk</p>
              <p className="text-2xl font-bold text-gray-800">{totalProduk}</p>
            </div>
          </div>

          {/* Kartu: Pesanan Hari Ini */}
          <div className="bg-white border rounded-2xl shadow-sm p-5 flex items-center gap-4">
            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pesanan Hari Ini</p>
              <p className="text-2xl font-bold text-gray-800">{pesananHariIni}</p>
            </div>
          </div>

          {/* Kartu: Pendapatan Bulan Ini */}
          <div className="bg-white border rounded-2xl shadow-sm p-5 flex items-center gap-4">
            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pendapatan Bulan Ini</p>
              <p className="text-2xl font-bold text-gray-800">
                Rp {pendapatanBulanIni.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>

        {/* Ajakan Kelola Produk */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              🛍️ Manajemen Produk
            </h2>
            <p className="text-sm text-gray-600">
              Tambahkan atau edit produk yang Anda jual dengan mudah.
            </p>
          </div>
          <Link
            to="/seller/products"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition"
          >
            ➕ Kelola Produk
          </Link>
        </div>
      </div>
    </div>
  );
}
