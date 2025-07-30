// frontend/src/components/driver/SidebarDriver.jsx

import React from 'react';
import { Link } from 'react-router-dom';

export default function SidebarDriver() {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-lg font-bold mb-6">🚗 Driver Panel</h2>
      <nav className="flex flex-col gap-2">
        <Link to="/dashboard/driver/orders" className="hover:bg-gray-700 px-3 py-2 rounded">
          📦 Pesanan Saya
        </Link>
        <Link to="/login" className="hover:bg-gray-700 px-3 py-2 rounded">
          🚪 Logout
        </Link>
      </nav>
    </div>
  );
}
