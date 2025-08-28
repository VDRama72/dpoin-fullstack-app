// ✅ FILE: backend/routes/userRoute.js (VERSI AKHIR DAN SEMPURNA)

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAdmin } = require('../middleware/authMiddleware'); // ✅ Import fungsi 'isAdmin'
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// ✅ Terapkan middleware 'isAdmin' untuk rute yang memerlukan otorisasi
router.post(
  '/',
  isAdmin, // ✅ Gunakan fungsi isAdmin di sini
  upload.fields([
    { name: 'fotoKtp', maxCount: 1 },
    { name: 'fotoSim', maxCount: 1 },
    { name: 'fotoStnk', maxCount: 1 },
    { name: 'namaWarung', maxCount: 1 },
  ]),
  userController.createUser
);

router.put(
  '/:id',
  isAdmin, // ✅ Gunakan fungsi isAdmin di sini
  upload.fields([
    { name: 'fotoKtp', maxCount: 1 },
    { name: 'fotoSim', maxCount: 1 },
    { name: 'fotoStnk', maxCount: 1 },
    { name: 'namaWarung', maxCount: 1 },
  ]),
  userController.updateUser
);

// ✅ Rute yang memerlukan otorisasi admin (tanpa upload file)
router.get('/', isAdmin, userController.getAllUsers);
router.get('/:id', isAdmin, userController.getUserById);
router.put('/:id/reset-password', isAdmin, userController.resetPassword);
router.delete('/:id', isAdmin, userController.deleteUser);

module.exports = router;