// ✅ FILE: src/components/seller/SidebarSeller.jsx (VERSI TERAKHIR DAN SEMPURNA)

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package } from 'lucide-react';

export default function SidebarSeller() {
  return (
    <nav className="p-4">
      <div className="space-y-2">
        <NavLink
          to="/seller/dashboard"
          className={({ isActive }) => 
            `flex items-center gap-3 p-2 rounded-lg text-gray-700 hover:bg-indigo-100 transition duration-150 ease-in-out ${isActive ? 'bg-indigo-200 font-semibold text-indigo-700' : ''}`
          }
        >
          <Home size={18} /> Dashboard
        </NavLink>

        <NavLink
          to="/seller/products"
          className={({ isActive }) => 
            `flex items-center gap-3 p-2 rounded-lg text-gray-700 hover:bg-indigo-100 transition duration-150 ease-in-out ${isActive ? 'bg-indigo-200 font-semibold text-indigo-700' : ''}`
          }
        >
          <Package size={18} /> Produk Saya
        </NavLink>
      </div>
    </nav>
  );
}