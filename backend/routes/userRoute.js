// ✅ FILE: backend/routes/userRoute.js (VERSI AKHIR & SEMPURNA)

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Rute untuk manajemen pengguna
router.get('/', isAdmin, userController.getAllUsers);
router.get('/drivers', isAdmin, userController.getAllDrivers);
router.get('/:id', isAdmin, userController.getUserById);
router.post(
    '/',
    isAdmin,
    upload.fields([
        { name: 'fotoKtp', maxCount: 1 },
        { name: 'fotoSim', maxCount: 1 },
        { name: 'fotoStnk', maxCount: 1 },
        { name: 'fotoWarung', maxCount: 1 },
    ]),
    userController.createUser
);
router.put(
    '/:id',
    isAdmin,
    upload.fields([
        { name: 'fotoKtp', maxCount: 1 },
        { name: 'fotoSim', maxCount: 1 },
        { name: 'fotoStnk', maxCount: 1 },
        { name: 'fotoWarung', maxCount: 1 },
    ]),
    userController.updateUser
);
router.put('/:id/reset-password', isAdmin, userController.resetPassword);
router.delete('/:id', isAdmin, userController.deleteUser);

// ✅ RUTE BARU: untuk manajemen keuangan driver
router.get('/finances/drivers/shift-report', isAdmin, userController.getDriverFinances);
router.put('/finances/drivers/batch-payment', isAdmin, userController.updateBatchPaymentStatus);

module.exports = router;