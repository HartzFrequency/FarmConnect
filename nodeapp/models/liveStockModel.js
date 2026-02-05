const mongoose = require('mongoose');

const liveStockModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    species: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    healthCondition: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    vaccinationStatus: {
        type: String,
        required: true
    },
    attachment: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Livestock', liveStockModel);