// ✅ FILE: src/pages/seller/SellerSignup.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SellerSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    namaWarung: '',
    alamat: '',
    phone: '',
    lat: '',
    lon: '',
    fotoKtp: null,
    fotoWarung: null,
  });

  const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY'; // GANTI DENGAN API KEY KAMU

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setForm({ ...form, [name]: files[0] });
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_API_KEY}`
      );
      const data = await res.json();
      if (data.status === 'OK') {
        return data.results[0].formatted_address;
      }
      return '';
    } catch (err) {
      console.error('❌ Gagal reverse geocoding:', err);
      return '';
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser tidak mendukung GPS.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const alamat = await reverseGeocode(lat, lon);
        setForm({ ...form, lat, lon, alamat });
      },
      (err) => {
        alert('❌ Gagal mendapatkan lokasi.');
        console.error(err);
      }
    );
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password || !form.namaWarung || !form.alamat || !form.phone) {
      alert('Semua kolom wajib diisi.');
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val) formData.append(key, val);
    });
    formData.append('role', 'penjual');

    try {
      // await axios.post('/api/users', formData);
      alert('✅ Pendaftaran berhasil!');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('❌ Pendaftaran gagal.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">🛍️ Pendaftaran Penjual</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input name="name" type="text" placeholder="Nama Anda" onChange={handleChange} className="border rounded p-2 w-full" />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} className="border rounded p-2 w-full" />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="border rounded p-2 w-full" />
          <input name="phone" type="text" placeholder="No. HP / WhatsApp" onChange={handleChange} className="border rounded p-2 w-full" />
          <input name="namaWarung" type="text" placeholder="Nama Warung" onChange={handleChange} className="border rounded p-2 w-full" />
          <input name="alamat" type="text" placeholder="Alamat Lengkap" value={form.alamat} onChange={handleChange} className="border rounded p-2 w-full" />

          <div className="flex gap-2 items-center">
            <button
              onClick={handleDetectLocation}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
            >
              📍 Deteksi Lokasi
            </button>
            {form.lat && (
              <span className="text-sm text-gray-600">
                ✅ Lokasi: {form.lat.toFixed(4)}, {form.lon.toFixed(4)}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Foto KTP</label>
            <input name="fotoKtp" type="file" accept="image/*" onChange={handleFileChange} className="mt-1 w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Foto Warung (opsional)</label>
            <input name="fotoWarung" type="file" accept="image/*" onChange={handleFileChange} className="mt-1 w-full" />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full font-semibold">
            ✅ Daftar Sekarang
          </button>
          <button onClick={() => navigate('/etalase')} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded w-full font-medium">
            ⬅️ Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
