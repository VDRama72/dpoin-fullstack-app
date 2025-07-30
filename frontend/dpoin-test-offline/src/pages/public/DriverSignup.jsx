// ✅ FILE: src/pages/public/DriverSignup.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function DriverSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    noHp: '',
    jenisKendaraan: '',
    platNomor: '',
    fotoKtp: null,
    fotoSim: null,
    fotoStnk: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    formData.append('role', 'driver');

    try {
      setLoading(true);
      await api.post('/users', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('✅ Pendaftaran berhasil! Silakan login.');
      navigate('/login');
    } catch (err) {
      console.error('❌ Gagal daftar driver:', err);
      alert('Pendaftaran gagal. Periksa kembali data Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">🛵 Daftar Sebagai Driver</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" type="text" placeholder="Nama Lengkap" required className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" required className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" required className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="noHp" type="text" placeholder="Nomor HP" required className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="jenisKendaraan" type="text" placeholder="Jenis Kendaraan (Motor/Mobil)" required className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="platNomor" type="text" placeholder="Plat Nomor" required className="w-full border p-2 rounded" onChange={handleChange} />
        <label className="block text-sm font-medium text-gray-700">Upload Foto KTP:</label>
        <input name="fotoKtp" type="file" accept="image/*" className="w-full border p-2 rounded" onChange={handleChange} />
        <label className="block text-sm font-medium text-gray-700">Upload Foto SIM:</label>
        <input name="fotoSim" type="file" accept="image/*" className="w-full border p-2 rounded" onChange={handleChange} />
        <label className="block text-sm font-medium text-gray-700">Upload Foto STNK:</label>
        <input name="fotoStnk" type="file" accept="image/*" className="w-full border p-2 rounded" onChange={handleChange} />

        <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded">
          {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
        </button>
      </form>
    </div>
  );
}