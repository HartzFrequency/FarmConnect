const Request = require('../models/requestModel');
const Feed = require('../models/feedModel');
const Medicine = require('../models/medicineModel')

const getAllRequests = async (_req, res) => {
    try {
        const requests = await Request.find({}).populate('itemId').populate('userId');
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await Request.findById(id).populate('itemId');
        if (!request) {
            return res.status(404).json({ message: `Cannot find any request with ID ${id}` });
        }
        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllRequestsBySupplier = async (req, res) => {
    try {
        const { supplierId } = req.params;
        const feeds = await Feed.find({ supplierId }).select('_id');
        const medicines = await Medicine.find({ supplierId }).select('_id');
        const feedIds = feeds.map(feed => feed._id);
        const medicineIds = medicines.map(medicine => medicine._id);
        const requests = await Request.find({
            $or: [
                { itemType: 'Feed', itemId: { $in: feedIds } },
                { itemType: 'Medicine', itemId: { $in: medicineIds } }
            ]
        }).populate('itemId').populate('userId', 'userName email');

        return res.status(200).json(requests);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getRequestsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const request = await Request.find({ userId }).populate('itemId');
        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const addRequest = async (req, res) => {
    try {
        const { itemType, itemId, quantity } = req.body;
        let item;
        if (itemType === 'Feed') {
            item = await Feed.findById(itemId);
        } else if (itemType === 'Medicine') {
            item = await Medicine.findById(itemId);
        }
        if (!item) {
            return res.status(404).json({ message: `${itemType} not found` });
        }
        if (item.availableUnits < quantity) {
            return res.status(400).json({
                message: `Insufficient units available. Only ${item.availableUnits} units available.`
            });
        }
        const request = await Request.create(req.body);

        return res.status(200).json({ message: 'Request Created Successfully', request });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const updateRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const request = await Request.findById(id).populate('itemId');

        if (!request) {
            return res.status(404).json({ message: `Cannot find any request with ID ${id}` });
        }

        if (status === 'Approved' && request.status === 'Pending') {
            const Model = request.itemType === 'Feed' ? Feed : Medicine;
            const item = await Model.findById(request.itemId);

            if (item.availableUnits < request.quantity) {
                return res.status(400).json({
                    message: `Insufficient units available. Only ${item.availableUnits} units available.`
                });
            }

            item.availableUnits -= request.quantity;
            await item.save();
        }

        request.status = status;
        await request.save();

        return res.status(200).json({ message: 'Request Status Updated Successfully', request });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await Request.findByIdAndDelete(id);
        if (!request) {
            return res.status(404).json({ message: `Cannot find any request with ID ${id}` });
        }
        res.status(200).json({ message: 'Request Deleted Successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllRequests, getRequestById, getAllRequestsBySupplier, getRequestsByUserId, addRequest, updateRequest, deleteRequest };