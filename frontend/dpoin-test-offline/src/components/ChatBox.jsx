// ✅ FILE: src/components/ChatBox.jsx

import React, { useEffect, useRef, useState } from 'react';
import socket from '../services/socket'; 
import api from '../services/api';     
import { FaPaperPlane, FaTimesCircle, FaCommentDots } from 'react-icons/fa'; 

export default function ChatBox({ orderId, senderRole }) { // senderRole: 'customer' or 'driver'
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(); 
  const [chatLoading, setChatLoading] = useState(true);
  const [chatError, setChatError] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false); 

  const myId = localStorage.getItem('userId'); 
  const myName = localStorage.getItem('userName') || localStorage.getItem('driverName') || 'Tamu'; 

  // --- 1. Ambil Riwayat Chat & Inisialisasi Socket.IO Listeners ---
  useEffect(() => {
    console.log("ChatBox: useEffect (init/listeners) triggered. orderId:", orderId); 

    // PENTING: Periksa status koneksi socket.io langsung saat useEffect berjalan
    if (socket.connected) {
      console.log("ChatBox: Socket already connected on mount. Setting socketConnected to true.");
      setSocketConnected(true);
      socket.emit('joinOrderRoom', orderId); 
      console.log(`ChatBox: Emitted 'joinOrderRoom' for orderId: ${orderId} (initial connect)`);
    } else {
      console.log("ChatBox: Socket not yet connected. Waiting for 'connect' event.");
    }

    if (!orderId) {
      setChatError('Order ID tidak tersedia untuk chat.');
      setChatLoading(false);
      console.error("ChatBox: No orderId provided."); 
      return;
    }

    const fetchChatHistory = async () => {
      try {
        setChatLoading(true);
        setChatError(null); // Reset error
        console.log("ChatBox: Fetching chat history for orderId:", orderId); 
        const res = await api.get(`/chats/${orderId}`); 
        setMessages(res.data); 
        setChatLoading(false);
        console.log("ChatBox: Chat history loaded:", res.data); 
      } catch (err) {
        console.error("ChatBox: Gagal memuat riwayat chat:", err.response?.data || err.message); 
        setChatError('Gagal memuat riwayat obrolan.');
        setChatLoading(false);
      }
    };

    fetchChatHistory(); 

    // Setup Socket.IO listeners (pastikan tidak ada duplikasi)
    socket.off('connect'); 
    socket.off('disconnect');
    socket.off('chatMessage');
    socket.off('connect_error');


    socket.on('connect', () => {
      console.log('ChatBox: Socket connected event fired! Setting socketConnected to true.'); 
      setSocketConnected(true); 
      socket.emit('joinOrderRoom', orderId); 
      console.log(`ChatBox: Emitted 'joinOrderRoom' for orderId: ${orderId} (from connect event listener)`); 
    });

    socket.on('disconnect', (reason) => { 
      console.log(`ChatBox: Socket disconnected event fired! Reason: ${reason}. Setting socketConnected to false.`); 
      setSocketConnected(false); 
    });

    socket.on('chatMessage', (msg) => {
      console.log('ChatBox: Received chatMessage event!', msg); 
      setMessages((prev) => {
        const isDuplicate = prev.some(
          (m) => (m._id && m._id === msg._id) || 
                 (m.timestamp === msg.timestamp && m.senderRole === msg.senderRole && m.text === msg.text && m.fromMe) 
        );
        if (isDuplicate) {
          console.log("ChatBox: Duplicate message detected (or local echo matched server echo). Updating existing message in state if it was local echo.", msg); 
          return prev.map(m => (m.timestamp === msg.timestamp && m.senderRole === msg.senderRole && m.text === msg.text && m.fromMe) ? { ...msg, fromMe: true } : m);
        } else {
          console.log("ChatBox: Adding truly new message:", msg); 
          return [...prev, msg];
        }
      });
    });

    socket.on('connect_error', (error) => {
      console.error('ChatBox: Socket.IO connection error event fired!', error); 
      setChatError('Koneksi chat terputus. Mohon refresh halaman.');
      setSocketConnected(false); 
    });

    // Clean up function saat komponen di-unmount
    return () => {
      console.log("ChatBox: Cleaning up useEffect for orderId:", orderId); 
      socket.emit('leaveOrderRoom', orderId); 
      socket.off('chatMessage'); 
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, [orderId]); 

  // ✅ BARU: Lacak perubahan socketConnected dan bandingkan dengan socket.connected
  useEffect(() => {
      console.log(`ChatBox: socketConnected STATE changed to: ${socketConnected}. Raw socket.connected is: ${socket.connected}`);
      if (!socketConnected && socket.connected) {
          // Jika state false tapi raw socket true, paksa update state
          console.log("ChatBox: Discrepancy detected! Forcing socketConnected to true.");
          setSocketConnected(true);
      }
  }, [socketConnected]); // Hanya jalankan saat socketConnected berubah

  // --- 2. Auto-scroll Chat ke Bawah ---
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatLoading]); 

  // --- 3. Fungsi Kirim Pesan ---
  const sendMessage = () => {
    if (!input.trim() || !socketConnected) { // Kondisi disabled di sini
      alert('Ketik pesan dan pastikan chat terhubung.');
      return;
    }

    const messagePayload = { 
      orderId: orderId,
      senderRole: senderRole, 
      senderName: myName, 
      text: input.trim(),
      timestamp: new Date().toISOString(), 
    };

    if (myId) { // myId adalah string ID user/driver yang valid, bukan "GUEST_USER"
        messagePayload.senderId = myId;
        // messagePayload.senderModel = senderRole === 'customer' ? 'User' : 'Driver'; // Uncomment jika perlu
    } else {
        // Jika tidak login, pastikan myName digunakan sebagai guestName di backend (jika ada field guestName di model Chat)
        // messagePayload.guestName = myName; // Uncomment jika perlu
    }

    setMessages((prev) => [...prev, { ...messagePayload, fromMe: true }]); 

    socket.emit('sendMessage', messagePayload); 

    setInput(''); 
  };

  // --- 4. Render UI ChatBox ---
  console.log("ChatBox: Rendering with chatLoading:", chatLoading, "chatError:", chatError, "messages.length:", messages.length, "socketConnected:", socketConnected); 

  if (chatLoading) { 
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-3"></div>
        <p className="text-gray-600">Memuat obrolan...</p>
      </div>
    );
  }

  if (chatError) {
    return (
      <div className="text-center py-8 text-red-600 bg-red-50 border border-red-200 rounded-lg flex flex-col items-center gap-2">
        <FaTimesCircle className="text-3xl" />
        <p className="font-semibold">Terjadi Kesalahan Chat:</p>
        <p className="text-sm">{chatError}</p>
      </div>
    );
  }

  return (
    <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FaCommentDots className="text-blue-500" /> Obrolan Pengantaran {socketConnected ? <span className="text-green-500 text-xs">(Online)</span> : <span className="text-red-500 text-xs">(Offline)</span>}
      </h3>

      {/* DEBUGGING VISUAL TAMBAHAN */}
      <div className="text-center text-xs mb-2 p-1 border rounded bg-gray-100">
          Debug State: {socketConnected ? 'TRUE' : 'FALSE'} | Raw Socket: {socket.connected ? 'TRUE' : 'FALSE'}
      </div>

      <div className="h-64 overflow-y-auto border border-gray-200 p-3 mb-4 rounded-lg bg-gray-50 text-sm flex flex-col">
        {messages.length === 0 ? (
          <p className="text-gray-500 italic text-center py-10">Belum ada pesan. Mulai percakapan!</p>
        ) : (
          messages.map((msg, idx) => {
            const isOwn = (msg.senderId && msg.senderId === myId) || (msg.fromMe); 
            const displayName = msg.senderName || (msg.senderRole === 'customer' ? 'Pelanggan' : 'Driver');

            return (
              <div key={msg._id || msg.timestamp + (msg.text || '') + idx} 
                   className={`flex mb-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-lg shadow-sm ${
                    isOwn ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'
                  }`}
                >
                  <p className="text-xs font-bold mb-1">
                    {isOwn ? 'Anda' : displayName}
                  </p>
                  <p>{msg.text ?? ''}</p> 
                  <span className="block text-right text-xs mt-1 opacity-80">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) ?? ''} 
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} /> 
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ketik pesan..."
          value={input}
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }} 
          disabled={!socketConnected} 
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!socketConnected} 
        >
          <FaPaperPlane /> Kirim
        </button>
      </div>
    </div>
  );
}