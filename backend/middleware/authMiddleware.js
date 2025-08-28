// ✅ FILE: backend/middleware/authMiddleware.js (VERSI AKHIR DAN SEMPURNA)

require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function auth(allowedRoles = []) {
  return async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ msg: 'User tidak ditemukan' });
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ msg: "Akses ditolak (tidak punya izin)" });
      }

      // ✅ PERBAIKAN: Simpan ID sebagai req.user.id untuk akses yang mudah
      req.user = {
        id: user._id, // Mengambil ObjectId
        role: user.role
      };
      next();
    } catch (err) {
      return res.status(401).json({ msg: "Token tidak valid", error: err.message });
    }
  };
}

const protect = auth();
const isAdmin = auth(['admin']);
const isDriver = auth(['driver']);
const isFinance = auth(['finance']);
const isSeller = auth(['penjual']);
const isCs = auth(['cs']);
const isCeo = auth(['ceo']);

module.exports = {
  auth,
  protect,
  isAdmin,
  isDriver,
  isFinance,
  isSeller,
  isCs,
  isCeo
};