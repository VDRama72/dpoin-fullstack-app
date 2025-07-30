// src/AppSeller.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import SellerDashboard from './pages/seller/SellerDashboard';
import ProductManagementSeller from './pages/seller/ProductManagementSeller';

export default function AppSeller() {
  return (
    <Routes>
      <Route path="/seller/dashboard" element={<SellerDashboard />} />
      <Route path="/seller/products" element={<ProductManagementSeller />} />
      <Route path="*" element={<Navigate to="/seller/dashboard" />} />
    </Routes>
  );
}
