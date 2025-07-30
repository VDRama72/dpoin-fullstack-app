// ✅ FILE FIXED: src/AppAdmin.jsx

import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
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

export default function AppAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 flex-col sm:flex-row overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/admin" element={<DashboardAdmin />} />
            <Route path="/dashboard/admin/users" element={<UserManagement />} />
            <Route path="/dashboard/admin/products" element={<ProductManagementAdmin />} />
            <Route path="/dashboard/admin/orders" element={<OrderManagementAdmin />} />
            <Route path="/dashboard/admin/rentals" element={<RentalManagementAdmin />} />
            <Route path="/dashboard/admin/finance" element={<FinanceManagementAdmin />} />
            <Route path="/dashboard/admin/finance/last" element={<FinanceLastTransactions />} />
            <Route path="/dashboard/admin/cs" element={<CSManagementAdmin />} />
            <Route path="/dashboard/admin/promo" element={<PromoManagementAdmin />} />
            <Route path="/dashboard/admin/reports" element={<ReportAnalyticsAdmin />} />
            <Route path="/dashboard/admin/settings" element={<SystemSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
