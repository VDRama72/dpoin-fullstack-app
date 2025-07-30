// src/pages/admin/UserManagement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SidebarAdmin from '../../components/admin/SidebarAdmin';

export default function UserManagement() {
  const [activeSection, setActiveSection] = useState('admin');
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'pembeli',
    namaWarung: ''
  });
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error('❌ Error mengambil data pengguna:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (activeSection !== 'user') setFilterRole('');
  }, [activeSection]);

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async () => {
    try {
      await axios.post('http://localhost:4000/api/users', newUser);
      setNewUser({ name: '', email: '', password: '', role: 'pembeli', namaWarung: '' });
      fetchUsers();
    } catch (err) {
      console.error('❌ Gagal menambahkan pengguna:', err);
    }
  };

  const handleEditUser = async () => {
    try {
      await axios.put(`http://localhost:4000/api/users/${editingUser._id}`, editingUser);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error('❌ Gagal mengedit pengguna:', err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin hapus pengguna ini secara permanen?')) {
      try {
        await axios.delete(`http://localhost:4000/api/users/${id}`);
        fetchUsers();
      } catch (err) {
        console.error('❌ Gagal menghapus pengguna:', err);
      }
    }
  };

  const handleSuspend = async (id, active) => {
    try {
      await axios.put(`http://localhost:4000/api/users/${id}`, { status: active ? 'inactive' : 'active' });
      fetchUsers();
    } catch (err) {
      console.error('❌ Gagal memperbarui status pengguna:', err);
    }
  };

  const getFilteredUsers = () => {
    const role = activeSection;
    if (role === 'user') {
      const userRoles = ['pembeli', 'penjual', 'driver'];
      return users.filter(u => userRoles.includes(u.role) && (!filterRole || u.role === filterRole));
    }
    return users.filter(u => u.role === role);
  };

  const filteredUsers = getFilteredUsers();

  return (
    <div className="flex gap-6">
      <SidebarAdmin setActiveSection={setActiveSection} />
      <div className="flex-1 bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Manajemen Pengguna</h2>
          {activeSection === 'user' && (
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="">Semua</option>
              <option value="pembeli">Pembeli</option>
              <option value="penjual">Penjual</option>
              <option value="driver">Driver</option>
            </select>
          )}
        </div>

        {/* Form Tambah Pengguna */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          <input name="name" placeholder="Nama" value={newUser.name} onChange={handleInputChange} className="border p-2 rounded w-full" />
          <input name="email" placeholder="Email" value={newUser.email} onChange={handleInputChange} className="border p-2 rounded w-full" />
          <input name="password" type="password" placeholder="Password" value={newUser.password} onChange={handleInputChange} className="border p-2 rounded w-full" />
          <select name="role" value={newUser.role} onChange={handleInputChange} className="border p-2 rounded w-full">
            <option value="admin">Admin</option>
            <option value="ceo">CEO</option>
            <option value="keuangan">Keuangan</option>
            <option value="cs">CS</option>
            <option value="driver">Driver</option>
            <option value="penjual">Penjual</option>
            <option value="pembeli">Pembeli</option>
          </select>

          {/* Tampilkan input nama warung hanya jika role penjual */}
          {newUser.role === 'penjual' && (
            <input
              name="namaWarung"
              placeholder="Nama Warung"
              value={newUser.namaWarung}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          )}

          <button onClick={handleCreateUser} className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">Tambah</button>
        </div>

        {/* Tabel Data Pengguna */}
        <div className="overflow-auto">
          <table className="min-w-full text-sm text-left text-gray-700 border">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id} className="border-t">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 capitalize">{user.role}</td>
                  <td className="px-4 py-2">{user.status || 'active'}</td>
                  <td className="px-4 py-2 space-x-1">
                    <button onClick={() => setEditingUser(user)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs">Edit</button>
                    <button onClick={() => handleSuspend(user._id, user.status !== 'inactive')} className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs">
                      {user.status === 'inactive' ? 'Aktifkan' : 'Nonaktifkan'}
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs">Hapus</button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr><td colSpan="5" className="text-center text-gray-400 py-4">Tidak ada data</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Form Edit Pengguna */}
        {editingUser && (
          <div className="mt-6 bg-yellow-50 p-4 rounded border border-yellow-300">
            <h3 className="font-semibold mb-2">Edit Pengguna</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <input name="name" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className="border p-2 rounded" />
              <input name="email" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} className="border p-2 rounded" />
              <select value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })} className="border p-2 rounded">
                <option value="admin">Admin</option>
                <option value="ceo">CEO</option>
                <option value="keuangan">Keuangan</option>
                <option value="cs">CS</option>
                <option value="driver">Driver</option>
                <option value="penjual">Penjual</option>
                <option value="pembeli">Pembeli</option>
              </select>
            </div>
            <button onClick={handleEditUser} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Simpan</button>
            <button onClick={() => setEditingUser(null)} className="text-sm text-gray-500">Batal</button>
          </div>
        )}
      </div>
    </div>
  );
}
