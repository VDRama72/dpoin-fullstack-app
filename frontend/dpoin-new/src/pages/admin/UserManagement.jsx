// ✅ FILE: src/pages/admin/UserManagement.jsx (FINAL REVISI)

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTelegramPlane, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaMoneyBillWave } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [roleFilter, setRoleFilter] = useState('semua');
    const [activeTab, setActiveTab] = useState('pengguna');
    const [driverFinances, setDriverFinances] = useState([]);
    const [newUser, setNewUser] = useState({
        name: '', email: '', password: '', role: 'pembeli', namaWarung: '',
        telegramChatId: '', lat: '', lon: '',
        fotoKtp: null, fotoSim: null, fotoStnk: null
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
    
    // ✅ Fungsi baru: Ambil data keuangan driver
    const fetchDriverFinances = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const res = await axios.get(`${API_BASE}/users/finances/drivers`, { headers });
            setDriverFinances(res.data);
        } catch (err) {
            console.error('❌ Gagal mengambil data keuangan driver:', err);
        }
    };
    
    // ✅ Fungsi baru: Update status pembayaran driver
    const updatePaymentStatus = async (orderId, status) => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await axios.put(`${API_BASE}/users/finances/drivers/${orderId}/payment-status`, { status }, { headers });
            fetchDriverFinances(); // Refresh data
        } catch (err) {
            console.error('❌ Gagal memperbarui status pembayaran:', err);
        }
    };

    useEffect(() => {
        if (activeTab === 'pengguna') {
            fetchUsers(roleFilter);
        } else if (activeTab === 'keuangan') {
            fetchDriverFinances();
        }
    }, [roleFilter, activeTab]);

    const handleInputChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleEditInputChange = (e) => {
        setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
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
        const sourceData = editMode ? editingUser : newUser;

        if (!editMode && (!sourceData.name || !sourceData.email || !sourceData.password)) {
            alert('Harap isi semua field');
            return;
        }

        const isDriver = sourceData.role === 'driver';
        if (isDriver) {
            if (!sourceData.fotoKtp || !sourceData.fotoSim || !sourceData.fotoStnk) {
                alert('Untuk role Driver, wajib upload foto KTP, SIM, dan STNK.');
                return;
            }
        }
        
        const isPenjual = sourceData.role === 'penjual';
        if (isPenjual) {
            if (!sourceData.namaWarung || !sourceData.lat || !sourceData.lon) {
                alert('Untuk role Penjual, wajib isi Nama Warung, Latitude, dan Longitude.');
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
                name: '', email: '', password: '', role: 'pembeli', namaWarung: '',
                telegramChatId: '', lat: '', lon: '',
                fotoKtp: null, fotoSim: null, fotoStnk: null
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
        setEditingUser({ 
            ...user, 
            password: '', 
            fotoKtp: null, 
            fotoSim: null, 
            fotoStnk: null 
        });
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditingUserId(null);
        setEditingUser(null);
        setNewUser({
            name: '', email: '', password: '', role: 'pembeli', namaWarung: '',
            telegramChatId: '', lat: '', lon: '',
            fotoKtp: null, fotoSim: null, fotoStnk: null
        });
    };

    const userData = editMode ? editingUser : newUser;
    const inputHandler = editMode ? handleEditInputChange : handleInputChange;
    const fileHandler = editMode ? handleEditFileChange : handleFileChange;

    return (
        <div className="bg-white p-6 rounded-lg shadow mb-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">⚙️ Admin Dashboard</h2>

            {/* ✅ TAB NAVIGASI BARU */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('pengguna')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'pengguna' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Manajemen Pengguna
                    </button>
                    <button
                        onClick={() => setActiveTab('keuangan')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'keuangan' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Manajemen Keuangan
                    </button>
                </nav>
            </div>

            {/* ✅ KONTEN MANAJEMEN PENGGUNA */}
            {activeTab === 'pengguna' && (
                <>
                    <h3 className="text-xl font-semibold mt-6 mb-4">👥 Manajemen Pengguna</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input type="text" name="name" placeholder="Nama" value={userData.name} onChange={inputHandler} className="border p-2 rounded w-full" />
                        <input type="email" name="email" placeholder="Email" value={userData.email} onChange={inputHandler} className="border p-2 rounded w-full" />
                        <input type="password" name="password" placeholder={editMode ? 'Kosongkan jika tidak diubah' : 'Password'} value={userData.password} onChange={inputHandler} className="border p-2 rounded w-full" />
                        <select name="role" value={userData.role} onChange={inputHandler} className="border p-2 rounded w-full">
                            <option value="admin">Admin</option>
                            <option value="keuangan">Keuangan</option>
                            <option value="cs">CS</option>
                            <option value="driver">Driver</option>
                            <option value="penjual">Penjual</option>
                            <option value="pembeli">Pembeli</option>
                        </select>

                        {/* ✅ PERUBAHAN: Tambah input Telegram untuk Penjual */}
                        {userData.role === 'penjual' && (
                            <>
                                <input type="text" name="namaWarung" placeholder="Nama Warung" value={userData.namaWarung || ''} onChange={inputHandler} className="border p-2 rounded w-full" />
                                <div className="relative col-span-1">
                                    <input type="text" name="lat" placeholder="Latitude Warung" value={userData.lat || ''} onChange={inputHandler} className="border p-2 pl-10 rounded w-full" />
                                    <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                                <div className="relative col-span-1">
                                    <input type="text" name="lon" placeholder="Longitude Warung" value={userData.lon || ''} onChange={inputHandler} className="border p-2 pl-10 rounded w-full" />
                                    <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                                {/* ✅ INPUT TELEGRAM UNTUK PENJUAL */}
                                <div className="relative col-span-1">
                                    <input type="text" name="telegramChatId" placeholder="ID Telegram" value={userData.telegramChatId || ''} onChange={inputHandler} className="border p-2 pl-10 rounded w-full" />
                                    <FaTelegramPlane className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </>
                        )}
                        
                        {(userData.role === 'driver') && (
                            <>
                                {/* ✅ HAPUS INPUT TELEGRAM DARI SINI */}
                                <div className="col-span-2 grid grid-cols-3 gap-2">
                                    <div className="flex flex-col">
                                        <label className="text-gray-500 text-xs mb-1">Foto KTP:</label>
                                        <input type="file" name="fotoKtp" accept="image/*" onChange={fileHandler} className="border p-2 rounded w-full text-xs" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-gray-500 text-xs mb-1">Foto SIM:</label>
                                        <input type="file" name="fotoSim" accept="image/*" onChange={fileHandler} className="border p-2 rounded w-full text-xs" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-gray-500 text-xs mb-1">Foto STNK:</label>
                                        <input type="file" name="fotoStnk" accept="image/*" onChange={fileHandler} className="border p-2 rounded w-full text-xs" />
                                    </div>
                                </div>
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
                </>
            )}

            {/* ✅ KONTEN MANAJEMEN KEUANGAN */}
            {activeTab === 'keuangan' && (
                <>
                    <h3 className="text-xl font-semibold mt-6 mb-4">💰 Manajemen Keuangan Driver</h3>
                    <div className="overflow-auto">
                        <table className="min-w-full text-sm text-left text-gray-700 border">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-4 py-2">Driver</th>
                                    <th className="px-4 py-2">ID Pesanan</th>
                                    <th className="px-4 py-2">Ongkir</th>
                                    <th className="px-4 py-2">Hak Driver (90%)</th>
                                    <th className="px-4 py-2">Status Pembayaran</th>
                                    <th className="px-4 py-2">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {driverFinances.length > 0 ? (
                                    driverFinances.map(item => (
                                        <tr key={item.orderId} className="border-t">
                                            <td className="px-4 py-2">{item.driverName}</td>
                                            <td className="px-4 py-2">{item.orderId.substring(18)}</td>
                                            <td className="px-4 py-2">Rp {item.shippingCost.toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-2 font-bold text-green-600">Rp {item.driverEarning.toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {item.paymentStatus === 'paid' ? 'Sudah Diterima' : 'Belum Diterima'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2">
                                                {item.paymentStatus !== 'paid' && (
                                                    <button onClick={() => updatePaymentStatus(item.orderId, 'paid')} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1">
                                                        <FaMoneyBillWave /> Bayar
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center text-gray-400 py-4">Tidak ada data keuangan driver.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

        </div>
    );
}