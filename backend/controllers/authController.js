// ✅ FILE: backend/controllers/authController.js (VERSI AKHIR & SEMPURNA)

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Email tidak terdaftar" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Password salah" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    user.token = token;
    await user.save();
    res.json({
      token,
      role: user.role,
      name: user.name,
      id: user._id
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.register = async (req, res) => {
  // ✅ BARIS PENTING UNTUK DIAGNOSA
  console.log('--- DATA DARI FRONTEND ---');
  console.log('req.body:', req.body);
  console.log('req.files:', req.files);
  console.log('--------------------------');

  const { 
    name, 
    email, 
    password, 
    role, 
    namaWarung, 
    alamat, 
    phone, 
    lat, 
    lon,
    // ✅ REVISI: Tambahkan telegramChatId dari body
    telegramChatId
  } = req.body;
  const fotoKtpFile = req.files.fotoKtp ? req.files.fotoKtp[0] : null;
  const fotoWarungFile = req.files.fotoWarung ? req.files.fotoWarung[0] : null;

  try {
    // ✅ REVISI: Tambahkan validasi untuk telegramChatId
    if (!name || !email || !password || !namaWarung || !alamat || !phone || !telegramChatId) {
      return res.status(400).json({ msg: "Semua kolom wajib diisi." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email sudah digunakan' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const fotoKtpPath = fotoKtpFile ? fotoKtpFile.path : null;
    const fotoWarungPath = fotoWarungFile ? fotoWarungFile.path : null;

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      namaWarung,
      alamat,
      // Simpan lat dan lon meskipun kosong
      lat,
      lon,
      fotoKtp: fotoKtpPath,
      fotoWarung: fotoWarungPath,
      telegramChatId, // ✅ REVISI: Simpan telegramChatId
      token: ''
    });

    await newUser.save();
    res.status(201).json({
      msg: 'User berhasil didaftarkan',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error('❌ Register error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};