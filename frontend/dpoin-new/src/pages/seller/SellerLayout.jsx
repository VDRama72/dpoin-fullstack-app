// ✅ FILE: src/pages/seller/SellerLayout.jsx (VERSI TERAKHIR DAN SEMPURNA)

import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import useTitle from '../../hooks/useTitle'; // Pastikan ini sudah benar
import SidebarSeller from '../../components/seller/SidebarSeller';

export default function SellerLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
 const handleLogout = () => {
    localStorage.setItem('isLoggedOut', 'true');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.dispatchEvent(new Event('storage'));
    window.location.href = '/';
  };


  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4 flex justify-between items-center z-50">
        <div className="flex items-center">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="sm:hidden text-gray-600 focus:outline-none focus:text-indigo-500 mr-4"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <h1 className="text-xl font-bold text-indigo-700">D'PoIN Seller</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 hidden sm:inline">Hai, {localStorage.getItem('userName')}</span>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:relative sm:translate-x-0 transition-transform duration-200 ease-in-out z-40 sm:w-64 w-full bg-white shadow-lg`}>
          <div className="p-4 flex justify-between items-center sm:hidden">
            <h2 className="text-xl font-bold text-indigo-700">Menu</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <SidebarSeller />
        </div>
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}