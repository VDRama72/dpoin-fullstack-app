// ✅ FILE: src/App.jsx

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 📄 Halaman Publik
import Etalase from './pages/public/Etalase';
import DpoiCar from './pages/public/DpoiCar';
import DpoiStore from './pages/public/DpoiStore';
import DpoiFood from './pages/public/DpoiFood';
import DpoiOrders from './pages/public/DpoiOrders';
import DriverSignup from './pages/public/DriverSignup';
import DriverDisclaimer from './pages/public/DriverDisclaimer';
import SellerDisclaimer from './pages/seller/SellerDisclaimer';
import SellerSignup from './pages/seller/SellerSignup';
import ProductDetail from './pages/public/ProductDetail';
import Checkout from './pages/public/Checkout';
import OrderStatusPage from './pages/public/OrderStatusPage'; // Pastikan ini diimport

// 📄 Halaman Login
import Login from './pages/Login';

// 📄 Dashboard Role
import AppAdmin from './AppAdmin';
import AppSeller from './AppSeller';
import DriverDashboardFinal from './pages/driver/DriverDashboardFinal';
import DpoiDriverOrderDetail from './pages/driver/DpoiDriverOrderDetail';

// 📄 Finance Pages
import FinanceUserPage from './pages/finance/FinanceUserPage';
import FinanceLastTransaction from './pages/finance/FinanceLastTransaction';

// 📄 Seller Pages
import SellerLayout from './pages/seller/SellerLayout';
import SellerDashboard from './pages/seller/SellerDashboard';
import ProductManagementSeller from './pages/seller/ProductManagementSeller';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [agreed, setAgreed] = useState(localStorage.getItem('disclaimerAccepted') === 'true');

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
      setRole(localStorage.getItem('role'));
      setAgreed(localStorage.getItem('disclaimerAccepted') === 'true');
    };

    if (localStorage.getItem('isLoggedOut') === 'true') {
      localStorage.removeItem('isLoggedOut');
      setToken(null);
      setRole(null);
    }

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        {/*
          ⭐⭐⭐ BAGIAN KRITIS: Rute-rute publik yang dapat diakses oleh SIAPA SAJA (login atau tidak)
          Ini harus berada di paling atas dan TIDAK dalam kondisi 'token'.
          Ini termasuk halaman utama, detail produk, keranjang, checkout, status order, dan pendaftaran.
        */}
        <Route path="/" element={<Etalase />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/orders" element={<DpoiOrders />} /> {/* Halaman keranjang */}
        <Route path="/checkout" element={<Checkout />} /> {/* Halaman checkout */}
        <Route path="/order-success/:orderId" element={<OrderStatusPage />} /> {/* Halaman status order */}
        <Route path="/dpoi-orders/:orderId" element={<OrderStatusPage />} /> {/* Ini juga diarahkan ke OrderStatusPage */}
        <Route path="/etalase/store/:storeIdentifier" element={<Etalase />} /> {/* Etalase yang difilter per toko */}

        {/* Halaman Login */}
        <Route path="/login" element={<Login />} />

        {/* Halaman Disclaimer dan Signup yang bersifat publik/awal */}
        <Route path="/dpoi-car" element={<DpoiCar />} />
        <Route path="/dpoi-store" element={<DpoiStore />} />
        <Route path="/dpoi-food" element={<DpoiFood />} />
        <Route path="/driver/disclaimer" element={<DriverDisclaimer />} />
        <Route path="/driver/signup" element={<DriverSignup />} />
        <Route path="/seller/disclaimer" element={<SellerDisclaimer />} />
        <Route path="/seller/signup" element={<SellerSignup />} />

        {/*
          ⭐⭐⭐ BAGIAN KRITIS: Rute-rute yang memerlukan user sudah login (memiliki token).
          Rute ini dikelompokkan berdasarkan peran (role).
          Jika token ada tetapi role tidak cocok, akan diarahkan ke fallback di bawah.
        */}
        {token && (
          <>
            {/* Admin Dashboard */}
            {role === 'admin' && (
              <Route path="/admin/*" element={<AppAdmin />} />
            )}
            {/* Admin Finance (Contoh: Finance Last Transaction di bawah admin root) */}
            {role === 'admin' && (
              <Route path="/finance/last" element={<FinanceLastTransaction />} />
            )}

            {/* Seller Dashboard */}
            {role === 'penjual' && (
              <>
                {/* Jika agreed, akses dashboard seller, jika tidak, redirect ke disclaimer */}
                {agreed ? (
                  <Route path="/seller/*" element={<SellerLayout />}>
                    <Route index element={<SellerDashboard />} />
                    <Route path="products" element={<ProductManagementSeller />} />
                  </Route>
                ) : (
                  <Route path="/seller/*" element={<Navigate to="/seller/disclaimer" />} />
                )}
              </>
            )}

            {/* Driver Dashboard */}
            {role === 'driver' && (
              <>
                <Route path="/dashboard/driver" element={<DriverDashboardFinal />} />
                <Route path="/driver/order/:id" element={<DpoiDriverOrderDetail />} />
              </>
            )}

            {/* Keuangan Dashboard */}
            {role === 'keuangan' && (
              <Route path="/finance/user" element={<FinanceUserPage />} />
            )}

            {/*
              FALLBACK SAAT SUDAH LOGIN:
              Jika user sudah login (ada token) TAPI:
              1. Role-nya tidak sesuai dengan rute dashboard di atas.
              2. Mencoba mengakses path yang tidak terdefinisi untuk role-nya.
              Arahkan mereka ke halaman utama (Etalase) atau dashboard default mereka.
            */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}

        {/*
          FALLBACK SAAT BELUM LOGIN:
          Jika user BELUM login (tidak ada token) DAN:
          1. Mencoba mengakses path yang tidak terdefinisi di rute publik di atas.
          2. Mencoba mengakses path dashboard yang seharusnya tidak bisa diakses tanpa login.
          Arahkan mereka ke halaman login.
        */}
        {!token && <Route path="*" element={<Navigate to="/login" />} />}

      </Routes>
    </Router>
  );
}