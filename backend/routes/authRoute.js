// ✅ FILE: backend/routes/authRoute.js (VERSI SEMPURNA)

const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// ✅ Rute Login: Tidak perlu middleware express.json() di sini
// Karena sudah diatur secara global di server.js
router.post('/login', login);

router.post('/register', upload.fields([
    { name: 'fotoKtp', maxCount: 1 },
    { name: 'fotoWarung', maxCount: 1 }
]), register);

module.exports = router;