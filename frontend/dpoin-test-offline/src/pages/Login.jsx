// src/pages/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTitle from '../hooks/useTitle';
import api from '../services/api';

export default function Login() {
  useTitle('Login - D’PoIN Admin Panel');
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, role, id, name } = res.data;

      // Simpan informasi pengguna
      localStorage.setItem('token', token);
      localStorage.setItem('role', role.toLowerCase());
      localStorage.setItem('userId', id);
      localStorage.setItem('userName', name);

      // Untuk seller, hapus dulu status disclaimer agar tidak skip
      if (role.toLowerCase() === 'penjual') {
        localStorage.removeItem('disclaimerAccepted');
      }

      // Trigger update global state listener
      window.dispatchEvent(new Event('storage'));

      // Navigasi sesuai role
      const lowerRole = role.toLowerCase();
      if (lowerRole === 'penjual') {
        navigate('/seller/disclaimer', { replace: true });
      } else if (lowerRole === 'admin') {
        navigate('/dashboard/admin', { replace: true });
      } else if (lowerRole === 'driver') {
        navigate('/dashboard/driver', { replace: true });
      } else if (lowerRole === 'keuangan') {
        navigate('/finance/user', { replace: true });
      } else {
        navigate('/', { replace: true });
      }

    } catch (err) {
      console.error('❌ Login gagal:', err);
      setError('Email atau password salah');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login Admin D’PoIN
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
