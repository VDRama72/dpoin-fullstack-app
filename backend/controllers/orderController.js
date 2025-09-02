// ✅ FILE: backend/controllers/orderController.js (FINAL DENGAN NOTIFIKASI TELEGRAM)

const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product'); // ✅ Tambahkan impor model Product
const bcrypt = require('bcryptjs');
const { getIo } = require('../utils/notifier');
const { calculateDistance } = require('../utils/distanceCalculator'); 
const { sendTelegramMessage } = require('../services/telegramService');
const moment = require('moment-timezone');

// Atur zona waktu sesuai lokasi Anda
moment.tz.setDefault("Asia/Makassar");

// ✅ FUNGSI BARU: Hitung ongkos kirim sesuai logika baru
const calculateShippingCost = (distanceKm) => {
    const baseCost = 8000;
    const additionalKm = Math.ceil(Math.max(0, distanceKm - 1));
    return baseCost + (additionalKm * 1000);
};

// --- Fungsi-fungsi CRUD lainnya (tidak berubah) ---
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil semua pesanan', error: err });
    }
};

exports.getOrdersByGuestPhone = async (req, res) => {
    try {
        const orders = await Order.find({ guestPhone: req.params.phone }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil pesanan tamu', error : err });
    }
};

exports.getOrdersForDriver = async (req, res) => {
    try {
        const orders = await Order.find({ driverId: req.params.driverId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil pesanan driver', error: err });
    }
};

exports.getAvailableOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            status: 'pending',
            driverId: null
        }).sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil order baru', error: err });
    }
};


// --- FUNGSI UTAMA: CREATE ORDER ---
exports.createOrder = async (req, res) => {
    try {
        const {
            userId, guestName, guestPhone, guestAddress,
            items, totalAmount, paymentMethod,
            latitude, longitude
        } = req.body;

        if (!items || !guestAddress || !latitude || !longitude || items.length === 0) {
            return res.status(400).json({ message: 'Data order tidak lengkap' });
        }

        const firstItem = items[0];
        const product = await Product.findById(firstItem.productId);
        if (!product) {
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }
        
        const seller = await User.findById(product.sellerId);

        if (!seller || !seller.alamat) {
            return res.status(500).json({ message: 'Gagal membuat order: Data penjual atau alamat tidak ditemukan.' });
        }
        
        if (!seller.lat || !seller.lon) {
            return res.status(500).json({ message: 'Gagal membuat order: Koordinat penjual tidak ditemukan.' });
        }
        
        const sellerLocation = { lat: seller.lat, lon: seller.lon };
        const buyerLocation = { lat: latitude, lon: longitude }; 
        const distanceKm = calculateDistance(sellerLocation, buyerLocation);

        if (isNaN(distanceKm)) {
            return res.status(500).json({ message: 'Gagal membuat order: Perhitungan jarak tidak valid.' });
        }
        
        const finalShippingCost = calculateShippingCost(distanceKm);

        const finalItems = items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity, 
            productPrice: item.productPrice,
            productImage: item.productImage,
            storeName: item.storeName
        }));

        const order = new Order({
            userId, guestName, guestPhone, guestAddress,
            items: finalItems,
            totalAmount,
            pickupAddress: seller.alamat,
            deliveryAddress: guestAddress,
            paymentMethod: paymentMethod || 'cod',
            shippingCost: finalShippingCost,
            grandTotal: totalAmount + finalShippingCost,
            status: 'pending', createdAt: new Date(), driverId: null,
            deliveryLocation: {
                latitude,
                longitude
            },
        });

        await order.save();
        
        // --- Notifikasi untuk Driver (Kode yang sudah ada) ---
        const driverChatId = process.env.TELEGRAM_DRIVER_CHAT_ID;
        if (driverChatId) {
            const messageText = `<b>🔔 Pesanan Baru!</b>
            
<b>ID Pesanan:</b> ${order._id}
<b>Pelanggan:</b> ${order.guestName}
<b>Telepon:</b> ${order.guestPhone}
<b>Alamat Kirim:</b> ${order.deliveryAddress}
<b>Total:</b> Rp ${order.grandTotal.toLocaleString('id-ID')}
        
Tolong segera periksa pesanan ini.`;

            try {
                await sendTelegramMessage(driverChatId, messageText);
            } catch (telegramError) {
                console.error('Gagal mengirim notifikasi Telegram ke driver:', telegramError);
            }
        }

        // ✅ KODE BARU: Notifikasi untuk Penjual
        if (seller.telegramChatId) {
            const messageTextSeller = `<b>🔔 Pesanan Baru!</b>\n\n` +
                                      `Ada pesanan masuk untuk warung Anda!\n` +
                                      `ID Pesanan: <b>${order._id.toString().slice(-6)}</b>\n` +
                                      `Nama Pelanggan: <b>${order.guestName}</b>\n` +
                                      `Total: <b>Rp ${order.totalAmount.toLocaleString('id-ID')}</b>\n\n` +
                                      `Segera cek aplikasi Anda untuk memproses pesanan ini.`;

            try {
                await sendTelegramMessage(seller.telegramChatId, messageTextSeller);
            } catch (telegramError) {
                console.error('Gagal mengirim notifikasi Telegram ke penjual:', telegramError);
            }
        }
        // ✅ END OF KODE BARU

        res.status(201).json({ message: 'Order berhasil dibuat', order });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: 'Gagal membuat order', error: error.message });
    }
};

// --- Fungsi-fungsi lainnya (tidak berubah) ---
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('driverId', 'name phone')
            .lean();
        if (!order) {
            return res.status(404).json({ message: 'Order tidak ditemukan' });
        }

        const driverInfo = order.driverId ? {
            name: order.driverId.name,
            phone: order.driverId.phone
        } : null;

        const finalOrder = {
            ...order,
            driverInfo,
            shippingCost: order.shippingCost || 0,
            grandTotal: order.grandTotal || (order.totalAmount + (order.shippingCost || 0))
        };

        res.json({ order: finalOrder });
    } catch (err) {
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil order', error: err });
    }
};

exports.repairTransactions = async (req, res) => {
    try {
        const orders = await Order.find({ status: { $in: ['selesai', 'completed'] } });
        let count = 0;

        for (const order of orders) {
            const exists = await Transaction.findOne({ orderId: order._id });
            if (!exists) {
                await Transaction.create({
                    orderId: order._id,
                    userId: order.userId || null,
                    guestName: order.guestName || null,
                    amount: order.totalAmount,
                    type: 'order',
                    status: 'completed'
                });
                count++;
            }
        }

        res.json({ message: `✅ ${count} transaksi berhasil diperbaiki.` });
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbaiki transaksi', error });
    }
};

exports.acceptOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { driverId, driverName } = req.body;

        const order = await Order.findOneAndUpdate(
            { _id: orderId, status: 'pending' },
            { status: 'accepted', driverId, driverName },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order tidak ditemukan atau sudah diambil' });
        }
        
        const driver = await User.findById(driverId);
        if (driver && driver.telegramChatId) {
            const messageText = `<b>🔔 Pesanan Baru!</b>
            
            <b>ID Pesanan:</b> ${order._id}
            <b>Pelanggan:</b> ${order.guestName}
            <b>Total:</b> Rp ${order.grandTotal.toLocaleString('id-ID')}`;

            try {
                await sendTelegramMessage(driver.telegramChatId, messageText);
            } catch (telegramError) {
                console.error('Gagal mengirim notifikasi Telegram:', telegramError);
            }
        }
        
        const io = getIo();
        if (io) {
            const updatedOrder = await Order.findById(order._id)
                .populate('driverId', 'name phone')
                .lean();
            io.to(order._id.toString()).emit('orderUpdate', updatedOrder);
            console.log(`Socket.IO: Emitted 'orderUpdate' for order ${order._id} to room.`);
        }

        res.json({ message: 'Order berhasil diambil oleh driver', order });
    } catch (error) {
        console.error('Error accepting order:', error);
        res.status(500).json({ message: 'Gagal menerima order', error });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, paymentMethod } = req.body;

        const order = await Order.findByIdAndUpdate(
            orderId,
            {
                status,
                paymentMethod: paymentMethod
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order tidak ditemukan' });
        }

        if (status === 'paid_by_customer') {
            console.log(`Backend: Order ${orderId} status changed to paid_by_customer with method ${paymentMethod}`);
        }

        const io = getIo();
        if (io) {
            const updatedOrder = await Order.findById(order._id)
                .populate('driverId', 'name phone')
                .lean();
            io.to(order._id.toString()).emit('orderUpdate', updatedOrder);
            console.log(`Socket.IO: Emitted 'orderUpdate' for order ${order._id} to room.`);
        }

        if (['selesai', 'completed'].includes(status)) {
            const existing = await Transaction.findOne({ orderId: order._id });
            if (!existing) {
                await Transaction.create({
                    orderId: order._id,
                    userId: order.userId || null,
                    guestName: order.guestName || null,
                    amount: order.totalAmount,
                    type: 'order',
                    status: 'completed'
                });
                count++;
            }
        }

        res.json({ message: 'Status order diperbarui', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Gagal memperbarui status', error });
    }
};