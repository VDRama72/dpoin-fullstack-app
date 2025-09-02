// ✅ FILE: src/pages/seller/SellerSignup.jsx (FINAL DENGAN REVISI DESAIN)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import useTitle from '../../hooks/useTitle'; 
import { FaMapMarkerAlt } from 'react-icons/fa'; // ✅ Import ikon untuk tombol

export default function SellerSignup() {
  useTitle('Daftar Penjual - D’PoIN');
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    namaWarung: '',
    alamat: '',
    phone: '',
    telegramChatId: '',
    lat: '',
    lon: '',
    fotoKtp: null,
    fotoWarung: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';

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
  
  const handleConnectTelegram = () => {
      // Ganti 'your_bot_username' dengan username bot Anda (tanpa @)
      const botUsername = 'your_bot_username'; 
      window.open(`https://t.me/${botUsername}`, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!form.name || !form.email || !form.password || !form.namaWarung || !form.alamat || !form.phone || !form.telegramChatId) {
      setError('Semua kolom wajib diisi, termasuk ID Telegram.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('password', form.password);
    formData.append('namaWarung', form.namaWarung);
    formData.append('alamat', form.alamat);
    formData.append('phone', form.phone);
    formData.append('lat', form.lat);
    formData.append('lon', form.lon);
    formData.append('role', 'penjual');
    formData.append('telegramChatId', form.telegramChatId);

    if (form.fotoKtp) {
      formData.append('fotoKtp', form.fotoKtp);
    }
    if (form.fotoWarung) {
      formData.append('fotoWarung', form.fotoWarung);
    }

    try {
      await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('✅ Pendaftaran berhasil! Silakan login untuk masuk ke dashboard.');
      navigate('/login');
    } catch (err) {
      console.error('❌ Pendaftaran gagal:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">🛍️ Pendaftaran Penjual</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input name="name" type="text" placeholder="Nama Anda" value={form.name} onChange={handleChange} className="border rounded p-2 w-full" required />
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="border rounded p-2 w-full" required />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="border rounded p-2 w-full" required />
            <input name="phone" type="text" placeholder="No. HP / WhatsApp" value={form.phone} onChange={handleChange} className="border rounded p-2 w-full" required />
            <input name="namaWarung" type="text" placeholder="Nama Warung" value={form.namaWarung} onChange={handleChange} className="border rounded p-2 w-full" required />
            
            <div className="relative col-span-1 md:col-span-2">
              <input 
                name="alamat" 
                type="text" 
                placeholder="Alamat Lengkap" 
                value={form.alamat} 
                onChange={handleChange} 
                className="border rounded p-2 w-full" 
                required 
              />
            </div>
            
            <div className="col-span-1 md:col-span-2 flex flex-col items-center">
              {/* ✅ REVISI: Ubah posisi dan style tombol */}
              <button 
                type="button" 
                onClick={handleDetectLocation} 
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                disabled={isLoading}
              >
                <FaMapMarkerAlt /> Deteksi Lokasi Saat Ini
              </button>
              {/* ✅ KETERANGAN BARU: Wajib diklik */}
              <p className="text-xs text-gray-500 mt-1 mb-2">
                <span className="text-red-500 font-bold">(Wajib diklik)</span> untuk mendapatkan koordinat lokasi Anda.
              </p>
              {form.lat && (
                <p className="text-sm text-gray-600 mt-1">
                  ✅ Lokasi: {form.alamat} ({form.lat.toFixed(4)}, {form.lon.toFixed(4)})
                </p>
              )}
            </div>

            <div className="col-span-1 md:col-span-2 mt-2 p-4 bg-gray-100 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">🔔 Notifikasi Pesanan via Telegram</h3>
              <p className="text-sm text-gray-600 mb-2">
                Untuk menerima notifikasi pesanan baru secara real-time, silakan hubungkan akun Telegram Anda.
              </p>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                <li>Klik tombol **"Hubungkan ke Bot"** di bawah ini.</li>
                <li>Setelah diarahkan ke Telegram, kirim pesan apa pun (contoh: `/start`).</li>
                <li>Bot akan membalas dengan ID unik Anda. **Salin** ID tersebut.</li>
                <li>**Tempelkan (paste)** ID yang sudah Anda salin ke kolom di bawah ini.</li>
              </ol>
            </div>

            <div className="col-span-1 md:col-span-2 flex items-center gap-2">
              <input 
                name="telegramChatId" 
                type="text" 
                placeholder="Masukkan ID Telegram Anda di sini" 
                value={form.telegramChatId} 
                onChange={handleChange} 
                className="border rounded p-2 w-full"
                required
              />
              <button
                type="button"
                onClick={handleConnectTelegram}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded whitespace-nowrap"
              >
                Hubungkan ke Bot
              </button>
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
            <button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full font-semibold disabled:bg-green-400">
              {isLoading ? 'Mendaftar...' : '✅ Daftar Sekarang'}
            </button>
            <button type="button" onClick={() => navigate('/etalase')} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded w-full font-medium">
              ⬅️ Kembali
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}