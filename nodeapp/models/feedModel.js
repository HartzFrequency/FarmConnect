const mongoose = require("mongoose");

const FeedSchema = new mongoose.Schema({
    feedName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    availableUnits:{
        type:Number,
        required:true
    },
    pricePerUnit: {
        type: Number,
        required: true
    },
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model("Feed", FeedSchema);