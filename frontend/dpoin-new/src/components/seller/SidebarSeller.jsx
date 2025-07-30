// ✅ FILE: src/components/seller/SidebarSeller.jsx

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Package, LogOut } from 'lucide-react';

export default function SidebarSeller() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path || location.pathname === path + '/';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('user');
    localStorage.removeItem('disclaimerAccepted');

    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white shadow h-full flex flex-col">
      <div className="p-4 text-xl font-bold text-indigo-700 border-b">D'PoIN Seller</div>
      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/seller/"
          className={`flex items-center gap-2 p-2 rounded hover:bg-indigo-50 ${
            isActive('/seller/') ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-700'
          }`}
        >
          <Home size={18} /> Dashboard
        </Link>

        <Link
          to="/seller/products"
          className={`flex items-center gap-2 p-2 rounded hover:bg-indigo-50 ${
            isActive('/seller/products') ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-700'
          }`}
        >
          <Package size={18} /> Produk Saya
        </Link>
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-2 py-2 text-left text-red-600 hover:bg-red-100 rounded"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
