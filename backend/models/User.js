// ✅ FILE: backend/models/User.js (VERSI FINAL & SEMPURNA)

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // ✅ Bidang Wajib untuk Login & Pendaftaran Umum
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['ceo', 'admin', 'keuangan', 'cs', 'driver', 'pembeli', 'penjual'],
        required: true
    },
    token: {
        type: String
    },

    // ✅ Bidang Baru untuk Penjual
    phone: {
        type: String
    },
    namaWarung: {
        type: String
    },
    alamat: {
        type: String
    },
    lat: { // Latitude dari lokasi warung
        type: Number
    },
    lon: { // Longitude dari lokasi warung
        type: Number
    },
    fotoKtp: { // Path file KTP yang diunggah
        type: String
    },
    fotoWarung: { // Path file foto warung yang diunggah
        type: String
    },

    // ✅ TAMBAHAN: Bidang Baru untuk Driver
    telegramChatId: { // Chat ID Telegram untuk notifikasi driver
        type: String
    },
    fotoSim: { // Path file SIM yang diunggah
        type: String
    },
    fotoStnk: { // Path file STNK yang diunggah
        type: String
    },

    // ✅ Bidang Tambahan
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    balance: {
        type: Number,
        default: 0
    }
}, {
    // ✅ Opsi Schema: Tambahkan timestamps untuk createdAt dan updatedAt
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);