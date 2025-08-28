// ✅ FILE: backend/server.js (VERSI TERAKHIR DAN SEMPURNA)

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');

// 🧠 Custom Utilities & Config
const { initSocketIO, getIo } = require('./utils/notifier');
const { MONGO_URI } = require('./config/db');

// ✅ Tentukan URL Frontend dari Environment Variables atau Hardcode untuk Testing
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ⚙️ Init Express & HTTP Server
const app = express();
const server = http.createServer(app);

// ✅ MIDDLEWARE: Atur CORS dan Body Parser dengan benar
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://192.168.58.216:5173',
        'https://my-admin-panel-brown.vercel.app',
        'https://dpoin-fullstack-app.onrender.com',
        FRONTEND_URL
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

// ✅ PERBAIKAN: Gunakan path.resolve() untuk memastikan jalur absolut yang benar
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// Inisialisasi Socket.IO Server
const io = new Server(server, {
    cors: {
        origin: [
            'http://localhost:5173',
            'http://192.168.58.216:5173',
            'https://my-admin-panel-brown.vercel.app',
            'https://dpoin-fullstack-app.onrender.com',
            FRONTEND_URL
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});

initSocketIO(io);

// 🔗 Routes
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/users', require('./routes/userRoute'));
app.use('/api/reports', require('./routes/reportRoute'));
app.use('/api/products', require('./routes/productRoute'));
app.use('/api/orders', require('./routes/orderRoute'));
app.use('/api/driver', require('./routes/driverRoute'));
app.use('/api/chats', require('./routes/chatRoute'));
app.use('/api/transactions', require('./routes/transactionRoute'));
app.use('/api/finance', require('./routes/financeRoutes'));
app.use('/api/seller/stats', require('./routes/sellerStatsRoute'));

// 🏠 Root Endpoint
app.get('/', (req, res) => {
    res.send("✅ D'PoIN Backend API is Running...");
});

// 🚀 Connect MongoDB and Start Server
mongoose.connect(process.env.MONGO_URI || MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        const PORT = process.env.PORT || 4000;
        server.listen(PORT, () => {
            console.log(`🚀 Server running at: http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });