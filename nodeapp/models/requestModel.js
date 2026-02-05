const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    itemType: {
        type: String,
        enum: ['Feed', 'Medicine'],
        required: true
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'itemType'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    requestDate: {
        type: Date,
        default: Date.now
    },
    species: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);