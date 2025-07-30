// ✅ FILE: src/pages/admin/UserManagement.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('semua');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'pembeli',
    namaWarung: '',
    fotoKtp: null,
    fotoSim: null,
    fotoStnk: null
  });
  const [editMode, setEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async (filter = 'semua') => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const url = filter === 'semua' ? `${API_BASE}/users` : `${API_BASE}/users?role=${filter}`;
      const res = await axios.get(url, { headers });
      setUsers(res.data);
    } catch (err) {
      console.error('❌ Gagal mengambil data pengguna:', err);
    }
  };

  useEffect(() => {
    fetchUsers(roleFilter);
  }, [roleFilter]);

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewUser({ ...newUser, [name]: files[0] });
  };

  const handleEditFileChange = (e) => {
    const { name, files } = e.target;
    setEditingUser({ ...editingUser, [name]: files[0] });
  };

  const handleCreateUser = async () => {
    if (!editMode && (!newUser.name || !newUser.email || !newUser.password)) {
      alert('Harap isi semua field');
      return;
    }

    // ✅ Validasi untuk role driver (wajib upload KTP, SIM, STNK)
    const isDriver = editMode ? editingUser.role === 'driver' : newUser.role === 'driver';
    const sourceData = editMode ? editingUser : newUser;

    if (isDriver) {
      if (!sourceData.fotoKtp || !sourceData.fotoSim || !sourceData.fotoStnk) {
        alert('Untuk role Driver, wajib upload foto KTP, SIM, dan STNK.');
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const formData = new FormData();
      Object.entries(sourceData).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      let url = `${API_BASE}/users`;
      if (editMode) url += `/${editingUserId}`;

      if (editMode) {
        await axios.put(url, formData, { headers });
      } else {
        await axios.post(url, formData, { headers });
      }

      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'pembeli',
        namaWarung: '',
        fotoKtp: null,
        fotoSim: null,
        fotoStnk: null
      });
      setEditMode(false);
      setEditingUser(null);
      fetchUsers(roleFilter);
    } catch (err) {
      console.error('❌ Gagal simpan pengguna:', err);
      alert(err.response?.data?.msg || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin hapus pengguna ini?')) return;
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${API_BASE}/users/${id}`, { headers });
      fetchUsers(roleFilter);
    } catch (err) {
      console.error('❌ Gagal menghapus pengguna:', err);
    }
  };

  const handleEdit = (user) => {
    setEditMode(true);
    setEditingUserId(user._id);
    setEditingUser({ ...user, password: '', fotoKtp: null, fotoSim: null, fotoStnk: null });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditingUserId(null);
    setEditingUser(null);
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: 'pembeli',
      namaWarung: '',
      fotoKtp: null,
      fotoSim: null,
      fotoStnk: null
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">👥 Manajemen Pengguna</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {(editMode ? editingUser : newUser) && (
          <>
            <input type="text" name="name" placeholder="Nama" value={(editMode ? editingUser.name : newUser.name)} onChange={(e) => editMode ? setEditingUser({ ...editingUser, name: e.target.value }) : handleInputChange(e)} className="border p-2 rounded w-full" />
            <input type="email" name="email" placeholder="Email" value={(editMode ? editingUser.email : newUser.email)} onChange={(e) => editMode ? setEditingUser({ ...editingUser, email: e.target.value }) : handleInputChange(e)} className="border p-2 rounded w-full" />
            <input type="password" name="password" placeholder={editMode ? 'Kosongkan jika tidak diubah' : 'Password'} value={(editMode ? editingUser.password : newUser.password)} onChange={(e) => editMode ? setEditingUser({ ...editingUser, password: e.target.value }) : handleInputChange(e)} className="border p-2 rounded w-full" />
            <select name="role" value={(editMode ? editingUser.role : newUser.role)} onChange={(e) => editMode ? setEditingUser({ ...editingUser, role: e.target.value }) : handleInputChange(e)} className="border p-2 rounded w-full">
              <option value="admin">Admin</option>
              <option value="keuangan">Keuangan</option>
              <option value="cs">CS</option>
              <option value="driver">Driver</option>
              <option value="penjual">Penjual</option>
              <option value="pembeli">Pembeli</option>
            </select>

            {((editMode ? editingUser.role : newUser.role) === 'penjual') && (
              <input type="text" name="namaWarung" placeholder="Nama Warung" value={(editMode ? editingUser.namaWarung : newUser.namaWarung)} onChange={(e) => editMode ? setEditingUser({ ...editingUser, namaWarung: e.target.value }) : handleInputChange(e)} className="border p-2 rounded w-full" />
            )}

            {((editMode ? editingUser.role : newUser.role) === 'driver') && (
              <>
                <label>Foto KTP:</label>
                <input type="file" name="fotoKtp" accept="image/*" onChange={editMode ? handleEditFileChange : handleFileChange} className="border p-2 rounded w-full" />
                <label>Foto SIM:</label>
                <input type="file" name="fotoSim" accept="image/*" onChange={editMode ? handleEditFileChange : handleFileChange} className="border p-2 rounded w-full" />
                <label>Foto STNK:</label>
                <input type="file" name="fotoStnk" accept="image/*" onChange={editMode ? handleEditFileChange : handleFileChange} className="border p-2 rounded w-full" />
              </>
            )}
          </>
        )}
      </div>

      <div className="flex gap-3 mb-6">
        <button onClick={handleCreateUser} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
          {editMode ? 'Simpan Perubahan' : 'Tambah Pengguna'}
        </button>
        {editMode && (
          <button onClick={handleCancelEdit} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">
            Batal Edit
          </button>
        )}
      </div>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter Role:</label>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="border p-2 rounded">
          <option value="semua">Semua</option>
          <option value="admin">Admin</option>
          <option value="keuangan">Keuangan</option>
          <option value="cs">CS</option>
          <option value="driver">Driver</option>
          <option value="penjual">Penjual</option>
          <option value="pembeli">Pembeli</option>
        </select>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-sm text-left text-gray-700 border">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-2">Nama</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2 capitalize">{u.role}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => handleEdit(u)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs">Edit</button>
                  <button onClick={() => handleDelete(u._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs">Hapus</button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-400 py-4">Tidak ada data pengguna</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
