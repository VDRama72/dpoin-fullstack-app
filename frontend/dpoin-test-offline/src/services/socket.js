    // ✅ FILE: src/services/socket.js (FIXED)
    import { io } from 'socket.io-client';

    const BACKEND_SOCKET_URL = import.meta.env.VITE_SOCKET_URL; 

    const socket = io(BACKEND_SOCKET_URL, {
      transports: ['websocket'], 
      withCredentials: true
    });

    socket.on('connect', () => {
      console.log('Socket.IO client connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket.IO client disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      // Ini akan menangkap error seperti net::ERR_CLEARTEXT_NOT_PERMITTED
      console.error('Socket.IO connection error:', error.message);
    });

    export default socket;
    