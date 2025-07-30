// src/components/admin/SidebarAdmin.jsx
import React from 'react';

export default function SidebarAdmin({ setActiveSection }) {
  return (
    <aside className="w-full md:w-60 bg-white shadow-md p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-indigo-700">📂 Manajemen User</h2>
      <ul className="space-y-2">
        <li>
          <button onClick={() => setActiveSection('admin')} className="w-full text-left text-gray-800 hover:text-indigo-600">
            🛠️ Admin
          </button>
        </li>
        <li>
          <button onClick={() => setActiveSection('ceo')} className="w-full text-left text-gray-800 hover:text-indigo-600">
            👑 CEO
          </button>
        </li>
        <li>
          <button onClick={() => setActiveSection('keuangan')} className="w-full text-left text-gray-800 hover:text-indigo-600">
            💰 Keuangan
          </button>
        </li>
        <li>
          <button onClick={() => setActiveSection('cs')} className="w-full text-left text-gray-800 hover:text-indigo-600">
            ☎️ Customer Service (CS)
          </button>
        </li>
        <li>
          <button onClick={() => setActiveSection('user')} className="w-full text-left text-gray-800 hover:text-indigo-600">
            👥 User (Penjual, Pembeli, Driver)
          </button>
        </li>
      </ul>
    </aside>
  );
}
