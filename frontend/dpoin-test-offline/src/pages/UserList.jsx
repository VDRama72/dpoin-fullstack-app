// frontend/my-admin-panel/src/pages/UserList.jsx
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'pembeli'
  });

  const fetchUsers = async () => {
    const res = await axios.get(`${import.meta.env.VITE_ADMIN_API_URL}/api/users`);
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = async () => {
    await axios.post(`${import.meta.env.VITE_ADMIN_API_URL}/api/users`, formData);
    fetchUsers();
    setFormData({ name: '', email: '', password: '', role: 'pembeli' });
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus user ini?")) return;
    await axios.delete(`${import.meta.env.VITE_ADMIN_API_URL}/api/users/${id}`);
    fetchUsers();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Daftar Pengguna</h2>

      {/* Form Tambah */}
      <div className="mb-6">
        <input placeholder="Nama" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="border p-2 mr-2" />
        <input placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="border p-2 mr-2" />
        <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="border p-2 mr-2" />
        <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="border p-2 mr-2">
          <option value="ceo">CEO</option>
          <option value="admin">Admin</option>
          <option value="keuangan">Keuangan</option>
          <option value="cs">CS</option>
          <option value="driver">Driver</option>
          <option value="pembeli">Pembeli</option>
          <option value="penjual">Penjual</option>
        </select>
        <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded">Tambah</button>
      </div>

      {/* Tabel Daftar User */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">Nama</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Role</th>
            <th className="py-2 px-4 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="py-2 px-4 border">{user.name}</td>
              <td className="py-2 px-4 border">{user.email}</td>
              <td className="py-2 px-4 border capitalize">{user.role}</td>
              <td className="py-2 px-4 border text-center">
                <button onClick={() => alert('Fitur edit segera hadir')} className="text-blue-500 mr-2">Edit</button>
                <button onClick={() => handleDelete(user._id)} className="text-red-500">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}