const Livestock = require('../models/liveStockModel');

const getAllLivestock = async (_req, res) => {
    try {
        const livestock = await Livestock.find({});
        if (livestock.length) {
            return res.status(200).json({ message: 'Retreived All livestock', livestock });
        }
        res.status(404).json({ message: 'Cannot find any livestock' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getLivestockById = async (req, res) => {
    try {
        const { id } = req.params;
        const livestock = await Livestock.findById(id);
        if (livestock) {
            return res.status(200).json({ message: 'Retreived Live stock', livestock });
        }
        res.status(404).json({ message: `Cannot find any livestock with ID ${id}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getLivestockByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const livestock = await Livestock.find({ userId });
        if (livestock) {
            res.status(200).json({ message: 'Retreived Live stock', livestock });
        }
        res.status(404).json({ message: `Cannot find any livestock with ID ${userId}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const addLivestock = async (req, res) => {
    try {
        await Livestock.create(req.body);
        res.status(200).json({ message: 'Livestock Added Successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateLivestock = async (req, res) => {
    try {
        const { id } = req.params;
        const livestock = await Livestock.findByIdAndUpdate(id, req.body, { new: true });
        if (!livestock) {
            return res.status(404).json({ message: `Cannot find any livestock with ID ${id}` });
        }
        res.status(200).json({ message: 'Livestock Updated Successfully', livestock });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteLivestock = async (req, res) => {
    try {
        const {id} = req.params;
        const livestock = await Livestock.findByIdAndDelete(id);
        if (!livestock) {
            return res.status(404).json({ message: `Cannot find any livestock with ID ${id}` });
        }
        res.status(200).json({ message: "Livestock Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllLivestock, getLivestockById, getLivestockByUserId, addLivestock, updateLivestock, deleteLivestock };