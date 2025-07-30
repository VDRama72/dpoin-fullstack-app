// src/components/Navbar.jsx

import React from 'react';

export default function Navbar({ onToggleSidebar }) {
  return (
    <header className="bg-white shadow px-4 py-3 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {/* Tombol sidebar hanya di HP */}
        <button
          onClick={onToggleSidebar}
          className="sm:hidden text-indigo-600 text-2xl font-bold"
        >
          ☰
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-indigo-700">D’PoIN Admin</h1>
      </div>
      <div>
        <button
          onClick={() => {
            localStorage.setItem('isLoggedOut', 'true');
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.dispatchEvent(new Event('storage'));
            window.location.href = '/';
          }}
          className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
