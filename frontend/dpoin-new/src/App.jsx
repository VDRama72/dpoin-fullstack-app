// ✅ FILE: src/App.jsx (FINAL REVISI)

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 📄 Import halaman publik
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
import OrderStatusPage from './pages/public/OrderStatusPage';

// 📄 Import halaman login
import Login from './pages/Login';

// 📄 Import dashboard & layout
import AppAdmin from './AppAdmin';
import SellerLayout from './pages/seller/SellerLayout';
import SellerDashboard from './pages/seller/SellerDashboard';
import ProductManagementSeller from './pages/seller/ProductManagementSeller';
import DriverDashboardFinal from './pages/driver/DriverDashboardFinal';
import DpoiDriverOrderDetail from './pages/driver/DpoiDriverOrderDetail';
import FinanceUserPage from './pages/finance/FinanceUserPage';
import FinanceLastTransaction from './pages/finance/FinanceLastTransaction';
import DriverFinanceReport from './pages/admin/DriverFinanceReport'; // ✅ TAMBAH: Import komponen baru

// ✅ KOMPONEN WRAPPER RUTE PRIVAT
const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default function App() {
    const [role, setRole] = useState(localStorage.getItem('role'));

    useEffect(() => {
        const handleStorageChange = () => {
            setRole(localStorage.getItem('role'));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <Router>
            <Routes>
                {/* Rute publik (tanpa otentikasi) */}
                <Route path="/" element={<Etalase />} />
                <Route path="/dpoi-car" element={<DpoiCar />} />
                <Route path="/dpoi-store" element={<DpoiStore />} />
                <Route path="/dpoi-food" element={<DpoiFood />} />
                <Route path="/dpoi-orders" element={<DpoiOrders />} />
                <Route path="/driver/signup" element={<DriverSignup />} />
                <Route path="/driver/disclaimer" element={<DriverDisclaimer />} />
                <Route path="/seller/signup" element={<SellerSignup />} />
                <Route path="/seller/disclaimer" element={<SellerDisclaimer />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success/:orderId" element={<OrderStatusPage />} />
                <Route path="/dpoi-orders/:orderId" element={<OrderStatusPage />} />
                <Route path="/etalase/store/:storeIdentifier" element={<Etalase />} />
                <Route path="/login" element={<Login />} />
                

                {/* Rute pribadi (memerlukan token dan role yang sesuai) */}
                <Route path="/dashboard/admin/*" element={<ProtectedRoute allowedRoles={['admin']}><AppAdmin /></ProtectedRoute>} />
                <Route path="/dashboard/driver" element={<ProtectedRoute allowedRoles={['driver']}><DriverDashboardFinal /></ProtectedRoute>} />
                <Route path="/driver/order/:id" element={<ProtectedRoute allowedRoles={['driver']}><DpoiDriverOrderDetail /></ProtectedRoute>} />
                
                <Route path="/seller/*" element={<ProtectedRoute allowedRoles={['penjual']}><SellerLayout /></ProtectedRoute>}>
                    <Route path="dashboard" element={<SellerDashboard />} />
                    <Route path="products" element={<ProductManagementSeller />} />
                    <Route index element={<Navigate to="dashboard" />} />
                    
                </Route>

                <Route path="/finance/user" element={<ProtectedRoute allowedRoles={['keuangan']}><FinanceUserPage /></ProtectedRoute>} />
                <Route path="/finance/last" element={<ProtectedRoute allowedRoles={['admin']}><FinanceLastTransaction /></ProtectedRoute>} />
                <Route path="/finance/driver-report" element={<ProtectedRoute allowedRoles={['admin', 'keuangan']}><DriverFinanceReport /></ProtectedRoute>} /> {/* ✅ TAMBAH: Rute baru untuk laporan keuangan driver */}
                
                {/*
                  Rute fallback: Jika tidak ada rute yang cocok, arahkan ke halaman utama
                */}
                <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
    );
}