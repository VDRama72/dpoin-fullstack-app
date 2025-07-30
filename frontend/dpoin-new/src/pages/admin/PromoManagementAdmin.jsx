// src/pages/admin/PromoManagementAdmin.jsx
import React, { useState, useEffect } from 'react';
import useTitle from '../../hooks/useTitle';
import api from '../../services/api';

export default function PromoManagementAdmin() {
  useTitle('🎁 Manajemen Promo & Banner - D’PoIN Admin');

  const [promos, setPromos] = useState([]);
  const [newPromo, setNewPromo] = useState({
    title: '',
    description: '',
    image: '',
    active: true,
  });

  const fetchPromos = async () => {
    try {
      const res = await api.get('/promos');
      setPromos(res.data);
    } catch (err) {
      console.error('❌ Gagal mengambil promo:', err);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleInputChange = (e) => {
    setNewPromo({ ...newPromo, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      await api.post('/promos', newPromo);
      setNewPromo({ title: '', description: '', image: '', active: true });
      fetchPromos();
    } catch (err) {
      console.error('❌ Gagal menambah promo:', err);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await api.put(`/promos/${id}`, { active: !currentStatus });
      fetchPromos();
    } catch (err) {
      console.error('❌ Gagal mengubah status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin hapus promo ini?')) {
      try {
        await api.delete(`/promos/${id}`);
        fetchPromos();
      } catch (err) {
        console.error('❌ Gagal menghapus promo:', err);
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">🎁 Manajemen Promo & Banner</h2>

      {/* Form Tambah */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <input name="title" placeholder="Judul" value={newPromo.title} onChange={handleInputChange} className="border p-2 rounded" />
        <input name="description" placeholder="Deskripsi" value={newPromo.description} onChange={handleInputChange} className="border p-2 rounded" />
        <input name="image" placeholder="URL Gambar" value={newPromo.image} onChange={handleInputChange} className="border p-2 rounded" />
        <button onClick={handleCreate} className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">Tambah</button>
      </div>

      {/* Daftar Promo */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm text-left">
          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              <th className="px-4 py-2">Judul</th>
              <th className="px-4 py-2">Deskripsi</th>
              <th className="px-4 py-2">Banner</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {promos.map((promo) => (
              <tr key={promo._id} className="border-t">
                <td className="px-4 py-2">{promo.title}</td>
                <td className="px-4 py-2">{promo.description}</td>
                <td className="px-4 py-2">
                  <img src={promo.image} alt="Banner" className="w-24 h-auto" />
                </td>
                <td className="px-4 py-2">{promo.active ? 'Aktif' : 'Nonaktif'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => handleToggle(promo._id, promo.active)} className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                    {promo.active ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                  <button onClick={() => handleDelete(promo._id)} className="bg-red-600 text-white px-2 py-1 rounded text-xs">Hapus</button>
                </td>
              </tr>
            ))}
            {promos.length === 0 && (
              <tr><td colSpan="5" className="text-center py-4 text-gray-400">Belum ada promo</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
