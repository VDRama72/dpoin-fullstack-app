// ✅ FILE: src/pages/seller/SellerLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarSeller from '../../components/seller/SidebarSeller';

export default function SellerLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarSeller />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

