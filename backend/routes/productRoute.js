// ✅ FILE: backend/routes/productRoute.js (VERSI AKHIR DAN SEMPURNA)

const express = require('express');
const router = express.Router();

// ✅ PERBAIKAN: Impor semua fungsi yang dibutuhkan secara eksplisit
const { 
  getAllProducts, 
  getProductById, 
  createProductByAdmin, 
  createProductBySeller,
  getMyProducts,
  getMyProductsCount,
  deleteProduct,
  updateProduct,
  updateProductBySeller
} = require('../controllers/productController');

const { isAdmin, isSeller } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// ✅ Rute yang dilindungi untuk penjual
router.get('/seller/products/count', isSeller, getMyProductsCount);
router.get('/seller', isSeller, getMyProducts);
router.post('/seller', isSeller, upload.single('image'), createProductBySeller);
router.put('/seller/:id', isSeller, upload.single('image'), updateProductBySeller);
router.delete('/:id', isSeller, deleteProduct);

// ✅ Rute yang dilindungi untuk admin
router.post('/admin', isAdmin, upload.single('image'), createProductByAdmin);
router.put('/admin/:id', isAdmin, upload.single('image'), updateProduct);

// ✅ Rute publik
router.get('/', getAllProducts);
router.get('/:id', getProductById);

module.exports = router;