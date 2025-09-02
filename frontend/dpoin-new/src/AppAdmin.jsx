// ✅ FILE FIXED: src/AppAdmin.jsx (VERSI SEMPURNA)

import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import DashboardAdmin from './pages/dashboards/DashboardAdmin';
import UserManagement from './pages/admin/UserManagement';
import ProductManagementAdmin from './pages/admin/ProductManagementAdmin';
import OrderManagementAdmin from './pages/admin/OrderManagementAdmin';
import RentalManagementAdmin from './pages/admin/RentalManagementAdmin';
import FinanceManagementAdmin from './pages/admin/FinanceManagementAdmin';
import FinanceLastTransactions from './pages/finance/FinanceLastTransaction';
import CSManagementAdmin from './pages/admin/CSManagementAdmin';
import PromoManagementAdmin from './pages/admin/PromoManagementAdmin';
import ReportAnalyticsAdmin from './pages/admin/ReportAnalyticsAdmin';
import SystemSettings from './pages/admin/SystemSettings';
import DriverFinanceReport from './pages/admin/DriverFinanceReport'; // ✅ TAMBAH: Import komponen baru

export default function AppAdmin() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        window.dispatchEvent(new Event('storage'));
        navigate('/', { replace: true });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Navbar 
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
                onLogout={handleLogout} 
            />

            <div className="flex flex-1 flex-col sm:flex-row overflow-hidden">
                <Sidebar 
                    isOpen={sidebarOpen} 
                    onClose={() => setSidebarOpen(false)} 
                    onLogout={handleLogout} 
                />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <Routes>
                        <Route path="/" element={<DashboardAdmin />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="products" element={<ProductManagementAdmin />} />
                        <Route path="orders" element={<OrderManagementAdmin />} />
                        <Route path="rentals" element={<RentalManagementAdmin />} />
                        <Route path="finance" element={<FinanceManagementAdmin />} />
                        <Route path="finance/last" element={<FinanceLastTransactions />} />
                        <Route path="cs" element={<CSManagementAdmin />} />
                        <Route path="promo" element={<PromoManagementAdmin />} />
                        <Route path="reports" element={<ReportAnalyticsAdmin />} />
                        <Route path="settings" element={<SystemSettings />} />
                        {/* ✅ TAMBAH: Rute baru untuk laporan keuangan driver */}
                        <Route path="finance/driver-report" element={<DriverFinanceReport />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}