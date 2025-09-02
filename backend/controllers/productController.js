// ✅ FILE: backend/controllers/productController.js (REVISI FINAL)

const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

const getAllProducts = async (req, res) => {
    try {
        const { seller, category, storeName } = req.query; // ✅ REVISI: Tambahkan category dan storeName
        let filter = {};

        if (seller) {
            if (!mongoose.Types.ObjectId.isValid(seller)) {
                return res.status(400).json({ msg: 'ID penjual tidak valid.' });
            }
            filter.sellerId = new mongoose.Types.ObjectId(seller);
        }

        // ✅ REVISI BARU: Filter berdasarkan kategori
        if (category && category.toLowerCase() !== 'semua') {
            filter.category = new RegExp(category, 'i');
        }

        // ✅ REVISI BARU: Filter berdasarkan nama warung
        if (storeName) {
            filter.storeName = new RegExp(storeName, 'i');
        }

        const products = await Product.find(filter)
            .populate('sellerId', 'name email namaWarung role status balance address nohp');

        res.json(products);
    } catch (err) {
        res.status(500).json({ msg: 'Gagal mengambil produk', error: err.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ msg: 'ID produk tidak valid' });
        }

        const product = await Product.findOne({ _id: productId })
            .populate('sellerId', 'name email namaWarung role status balance address nohp');

        if (!product) return res.status(404).json({ msg: 'Produk tidak ditemukan' });

        const productResponse = {
            ...product.toObject(),
            sellerInfo: product.sellerId 
        };
        
        res.json(productResponse);

    } catch (err) {
        console.error('❌ Gagal ambil detail produk:', err.message);
        res.status(500).json({ msg: 'Gagal mengambil detail produk', error: err.message });
    }
};

const createProductByAdmin = async (req, res) => {
    const { name, description, price, sellerId, stock = 0, category } = req.body;
    try {
        const seller = await User.findById(sellerId);
        if (!seller || seller.role !== 'penjual') {
            return res.status(400).json({ msg: 'Penjual tidak valid' });
        }

        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const newProduct = new Product({
            name,
            description,
            price,
            stock,
            sellerId,
            storeName: seller.namaWarung || seller.name || 'Tanpa Nama',
            category,
            image: imagePath,
            commissionRate: 0.1,
        });

        await newProduct.save();
        res.status(201).json({ msg: 'Produk berhasil ditambahkan', product: newProduct });
    } catch (err) {
        res.status(500).json({ msg: 'Gagal menambahkan produk', error: err.message });
    }
};

const createProductBySeller = async (req, res) => {
    const { name, description, price, stock = 0, category } = req.body;
    const sellerId = req.user.id;

    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'Gambar produk wajib diunggah' });
        }

        const seller = await User.findById(sellerId);
        if (!seller || seller.role !== 'penjual') {
            return res.status(403).json({ msg: 'Akun tidak memiliki izin sebagai penjual' });
        }

        const imagePath = `/uploads/${req.file.filename}`;

        const newProduct = new Product({
            name,
            description,
            price,
            stock,
            sellerId,
            storeName: seller.namaWarung || seller.name || 'Tanpa Nama',
            category,
            image: imagePath,
            commissionRate: 0.1,
        });

        await newProduct.save();
        res.status(201).json({ msg: 'Produk berhasil ditambahkan oleh seller', product: newProduct });
    } catch (err) {
        console.error('❌ Gagal menambahkan produk:', err);
        res.status(500).json({ msg: 'Gagal menambahkan produk', error: err.message });
    }
};

const getMyProducts = async (req, res) => {
    try {
        const sellerId = req.user.id;

        if (!sellerId) {
            return res.status(400).json({ msg: "ID penjual tidak ditemukan dalam token." });
        }

        if (!mongoose.Types.ObjectId.isValid(sellerId)) {
            return res.status(400).json({ msg: 'ID penjual tidak valid.' });
        }

        const products = await Product.find({ sellerId: new mongoose.Types.ObjectId(sellerId) });
        res.json(products);

    } catch (err) {
        console.error('❌ Gagal mengambil produk seller:', err.message);
        res.status(500).json({ msg: 'Gagal mengambil produk seller', error: err.message });
    }
};

const getMyProductsCount = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const count = await Product.countDocuments({ sellerId });
        res.json({ count });
    } catch (err) {
        console.error('❌ Gagal mengambil jumlah produk:', err.message);
        res.status(500).json({ msg: 'Gagal mengambil jumlah produk', error: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ msg: 'Produk tidak ditemukan' });
        res.json({ msg: 'Produk berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ msg: 'Gagal menghapus produk', error: err.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, category } = req.body;

        const updated = await Product.findByIdAndUpdate(
            id,
            { name, description, price, stock, category },
            { new: true }
        );

        if (!updated) return res.status(404).json({ msg: 'Produk tidak ditemukan' });

        res.json({ msg: 'Produk berhasil diperbarui', product: updated });
    } catch (err) {
        res.status(500).json({ msg: 'Gagal memperbarui produk', error: err.message });
    }
};

const updateProductBySeller = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, category } = req.body;
        const sellerId = req.user.id;

        const product = await Product.findById(id);

        if (!product || product.sellerId.toString() !== sellerId.toString()) {
            return res.status(403).json({ msg: 'Akses ditolak' });
        }

        const imagePath = req.file ? `/uploads/${req.file.filename}` : product.image;

        product.name = name;
        product.description = description;
        product.price = price;
        product.stock = stock;
        product.category = category;
        product.image = imagePath;

        await product.save();

        res.json({ msg: 'Produk berhasil diperbarui oleh seller', product });
    } catch (err) {
        res.status(500).json({ msg: 'Gagal memperbarui produk oleh seller', error: err.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProductByAdmin,
    createProductBySeller,
    getMyProducts,
    deleteProduct,
    updateProduct,
    updateProductBySeller,
    getMyProductsCount,
};