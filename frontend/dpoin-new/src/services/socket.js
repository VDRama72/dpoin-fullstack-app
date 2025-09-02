// ✅ FILE: src/services/socket.js (VERSI AKHIR DAN SEMPURNA)

import { io } from 'socket.io-client';

// Dapatkan URL backend dari environment variable
const BACKEND_SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

// Tentukan apakah kita menggunakan HTTPS atau tidak
const isSecure = window.location.protocol === 'https:';
const protocol = isSecure ? 'wss' : 'ws';

// Pisahkan protokol dari URL dan gabungkan kembali dengan protokol yang benar
const finalUrl = `${protocol}://${BACKEND_SOCKET_URL.replace(/^(https?|wss?):\/\//, '')}`;

// Buat koneksi socket.io
const socket = io(finalUrl, {
  transports: ['websocket'],
  // Opsi secure: true dihapus karena protokol sudah ditentukan
  withCredentials: true
});

socket.on('connect', () => {
  console.log('✅ Socket.IO connected:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.warn('⚠️ Socket.IO disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error.message);
});

socket.io.on('error', (err) => {
  console.error('❌ Socket.IO raw error:', err);
});

export default socket;