// ✅ FILE: backend/models/Order.js (FINAL REVISI)

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    guestName: { type: String, default: null },
    guestPhone: { type: String, default: null },
    guestAddress: { type: String, default: null },
    
    deliveryLocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },

    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            productName: String,
            quantity: Number,
            productPrice: Number,
            productImage: String,
            storeName: String
        }
    ],
    totalAmount: Number,
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'on_delivery', 'delivered', 'paid_by_customer', 'completed', 'cancelled', 'returned'],
        default: 'pending' 
    }, 
    pickupAddress: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    
    driverName: { type: String },
    driverPhone: { type: String },
    paymentMethod: {
        type: String, 
        enum: ['cod', 'non-cash', 'paid_by_customer', 'completed_with_cash', 'completed_with_non_cash'], 
        default: 'cod' 
    },
    shippingCost: { type: Number, default: 0 },
    grandTotal: { type: Number },

    paymentStatus: {
        type: String,
        enum: ['paid', 'unpaid'],
        default: 'unpaid'
    },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);