const User = require('../models/User');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const { sendTelegramMessage } = require('../services/telegramService'); // ✅ IMPORT YANG SUDAH DIPERBAIKI

// Set your local timezone
moment.tz.setDefault("Asia/Makassar");

// --- User CRUD Functions
const getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const filter = role ? { role } : {};
        const users = await User.find(filter).select('-password');
        res.json(users);
    } catch (err) {
        console.error('❌ Error in getAllUsers:', err);
        res.status(500).json({ msg: "Failed to fetch user data", error: err.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error('❌ Error in getUserById:', err);
        res.status(500).json({ msg: 'Failed to fetch user data', error: err.message });
    }
};

const createUser = async (req, res) => {
    const { name, email, password, role, namaWarung, lat, lon, telegramChatId } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ msg: 'Email is already in use' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });
        
        // Save data based on role
        if (role === 'penjual') {
            newUser.namaWarung = namaWarung;
            newUser.lat = lat;
            newUser.lon = lon;
            newUser.telegramChatId = telegramChatId;
        }

        if (role === 'driver') {
            // Driver-specific logic can go here
        }

        await newUser.save();
        res.status(201).json({
            msg: 'User successfully added',
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                namaWarung: newUser.namaWarung || null
            }
        });
    } catch (err) {
        console.error('❌ Error in createUser:', err);
        res.status(500).json({ msg: 'Failed to add user', error: err.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role, status, namaWarung, lat, lon, telegramChatId } = req.body;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;
        if (typeof status !== 'undefined') user.status = status;
        if (password && password.trim() !== '') {
            user.password = await bcrypt.hash(password, 10);
        }

        // Update data based on role
        if (role === 'penjual') {
            user.namaWarung = namaWarung || '';
            user.lat = lat;
            user.lon = lon;
            user.telegramChatId = telegramChatId;
        } else {
            user.namaWarung = undefined;
            user.lat = undefined;
            user.lon = undefined;
            user.telegramChatId = undefined; // Clear field if role changes
        }

        await user.save();
        res.json({ msg: 'User successfully updated' });
    } catch (err) {
        console.error('❌ Error in updateUser:', err);
        res.status(500).json({ msg: 'Failed to update user', error: err.message });
    }
};

const resetPassword = async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ msg: 'Password successfully reset' });
    } catch (err) {
        console.error('❌ Error in resetPassword:', err);
        res.status(500).json({ msg: 'Failed to reset password', error: err.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ msg: 'User not found' });
        res.json({ msg: 'User successfully deleted' });
    } catch (err) {
        console.error('❌ Error in deleteUser:', err);
        res.status(500).json({ msg: 'Failed to delete user', error: err.message });
    }
};

// --- Driver Finances Functions
const getAllDrivers = async (req, res) => {
    try {
        const drivers = await User.find({ role: 'driver' }).select('name _id');
        res.json(drivers);
    } catch (err) {
        console.error('❌ Error in getAllDrivers:', err);
        res.status(500).json({ msg: "Failed to fetch driver data", error: err.message });
    }
};

const getDriverFinances = async (req, res) => {
    try {
        const { startDate, endDate, driverId } = req.query;

        const startOfDay = moment(startDate).startOf('day');
        const endOfDay = moment(endDate).endOf('day');

        const filter = {
            status: 'completed',
            driverId: driverId || { $ne: null },
            createdAt: { $gte: startOfDay.toDate(), $lte: endOfDay.toDate() }
        };

        const completedOrders = await Order.find(filter)
            .populate('driverId', 'name')
            .lean();

        const driverReports = {};

        completedOrders.forEach(order => {
            const driverId = order.driverId._id.toString();
            const orderTime = moment(order.createdAt).tz("Asia/Makassar");

            if (!driverReports[driverId]) {
                driverReports[driverId] = {
                    driverId: driverId,
                    driverName: order.driverId.name,
                    morningShift: { orders: [], totalEarning: 0 },
                    eveningShift: { orders: [], totalEarning: 0 },
                };
            }

            const earning = order.shippingCost * 0.9;
            const reportItem = { orderId: order._id, earning, paymentStatus: order.paymentStatus || 'unpaid' };

            if (orderTime.hour() < 17) {
                driverReports[driverId].morningShift.orders.push(reportItem);
                driverReports[driverId].morningShift.totalEarning += earning;
            } else {
                driverReports[driverId].eveningShift.orders.push(reportItem);
                driverReports[driverId].eveningShift.totalEarning += earning;
            }
        });

        res.json(Object.values(driverReports));
    } catch (err) {
        console.error('❌ Error in getDriverFinances:', err);
        res.status(500).json({ msg: 'Failed to fetch driver financial data', error: err.message });
    }
};

const updateBatchPaymentStatus = async (req, res) => {
    try {
        const { orderIds, status } = req.body;

        if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
            return res.status(400).json({ msg: 'Invalid list of order IDs.' });
        }

        const result = await Order.updateMany(
            { _id: { $in: orderIds } },
            { paymentStatus: status }
        );
        
        if (result.modifiedCount === 0) {
            return res.status(404).json({ msg: 'No orders found or updated.' });
        }

        res.json({ msg: `${result.modifiedCount} payment statuses successfully updated.` });
    } catch (err) {
        console.error('❌ Error in updateBatchPaymentStatus:', err);
        res.status(500).json({ msg: 'Failed to update payment status', error: err.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    resetPassword,
    getAllDrivers,
    getDriverFinances,
    updateBatchPaymentStatus,
};