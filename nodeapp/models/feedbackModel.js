const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    reviewText: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Feed', 'Medicine']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'category'
    },
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);