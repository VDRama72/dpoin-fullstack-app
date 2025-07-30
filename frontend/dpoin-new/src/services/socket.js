// ✅ FILE: src/services/socket.js
import { io } from 'socket.io-client';

const BACKEND_SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const socket = io(BACKEND_SOCKET_URL, {
  transports: ['websocket'], // wajib di mobile
  secure: true,              // ✅ penting untuk WSS
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
