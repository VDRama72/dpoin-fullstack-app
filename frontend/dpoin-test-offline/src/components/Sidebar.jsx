// src/components/Sidebar.jsx

import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const linkClass = "hover:underline px-2 py-1 rounded block";
  const activeClass = "bg-indigo-100 font-semibold";

  return (
    <>
      {/* Sidebar Desktop */}
      <aside className="hidden sm:block w-64 bg-white shadow p-4">
        <SidebarContent location={location} linkClass={linkClass} activeClass={activeClass} />
      </aside>

      {/* Sidebar Mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 sm:hidden" onClick={onClose}>
          <aside
            className="w-64 bg-white shadow p-4 h-full absolute left-0 top-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-blue-700">🛠️ Admin</h2>
              <button onClick={onClose} className="text-red-600 font-bold text-lg">×</button>
            </div>
            <SidebarContent location={location} linkClass={linkClass} activeClass={activeClass} />
          </aside>
        </div>
      )}
    </>
  );
}

function SidebarContent({ location, linkClass, activeClass }) {
  return (
    <nav className="flex flex-col gap-2 text-blue-700">
      <Link to="/dashboard/admin" className={`${linkClass} ${location.pathname === '/dashboard/admin' ? activeClass : ''}`}>🏠 Dashboard</Link>
      <Link to="/dashboard/admin/users" className={`${linkClass} ${location.pathname === '/dashboard/admin/users' ? activeClass : ''}`}>👥 Pengguna</Link>
      <Link to="/dashboard/admin/products" className={`${linkClass} ${location.pathname === '/dashboard/admin/products' ? activeClass : ''}`}>📦 Produk</Link>
      <Link to="/dashboard/admin/orders" className={`${linkClass} ${location.pathname === '/dashboard/admin/orders' ? activeClass : ''}`}>🧾 Pesanan</Link>
      <Link to="/dashboard/admin/rentals" className={`${linkClass} ${location.pathname === '/dashboard/admin/rentals' ? activeClass : ''}`}>🚗 Rental</Link>
      <Link to="/dashboard/admin/finance" className={`${linkClass} ${location.pathname === '/dashboard/admin/finance' ? activeClass : ''}`}>💰 Keuangan</Link>
      <Link to="/dashboard/admin/cs" className={`${linkClass} ${location.pathname === '/dashboard/admin/cs' ? activeClass : ''}`}>☎️ CS & Komplain</Link>
      <Link to="/dashboard/admin/promo" className={`${linkClass} ${location.pathname === '/dashboard/admin/promo' ? activeClass : ''}`}>🎁 Promo & Banner</Link>
      <Link to="/dashboard/admin/reports" className={`${linkClass} ${location.pathname === '/dashboard/admin/reports' ? activeClass : ''}`}>📊 Laporan</Link>
      <Link to="/dashboard/admin/settings" className={`${linkClass} ${location.pathname === '/dashboard/admin/settings' ? activeClass : ''}`}>⚙️ Pengaturan</Link>
    </nav>
  );
}
