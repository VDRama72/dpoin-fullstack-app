// ✅ FILE: backend/server.js (HTTPS READY)
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const https = require('https');
const { Server } = require('socket.io');

// 🧠 Custom Utilities & Config
const { initSocketIO } = require('./utils/notifier');
const { MONGO_URI } = require('./config/db');

// ✅ Tentukan URL Frontend dari Environment Variables atau Hardcode untuk Testing
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://localhost:5173';

const app = express();

// ✅ HTTPS Sertifikat Lokal
const key = fs.readFileSync(path.join(__dirname, '../localhost-key.pem'));
const cert = fs.readFileSync(path.join(__dirname, '../localhost.pem'));

// ✅ MIDDLEWARE
app.use(cors({
    origin: [
        'https://localhost:5173',
        'http://192.168.58.216:5173',
        'https://my-admin-panel-brown.vercel.app',
        'https://dpoin-fullstack-app.onrender.com',
        FRONTEND_URL
    ],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// ✅ HTTPS Server + Socket.IO
const httpsServer = https.createServer({ key, cert }, app);
const io = new Server(httpsServer, {
    cors: {
        origin: [
            'https://localhost:5173',
            FRONTEND_URL,
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});

initSocketIO(io);

// ✅ Routes
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

app.get('/', (req, res) => {
    res.send("✅ D'PoIN Backend API is Running with HTTPS...");
});

// 🚀 Connect MongoDB & Start Server
mongoose.connect(process.env.MONGO_URI || MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        const PORT = process.env.PORT || 4000;
        httpsServer.listen(PORT, () => {
            console.log(`🚀 Server running at: https://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });
