const Feed = require('../models/feedModel');
const Request = require('../models/requestModel');

const getAllFeeds = async (_req, res) => {
    try {
        const allFeeds = await Feed.find({});
        const feeds = allFeeds.filter((feed)=>feed.availableUnits>0);
        res.status(200).json(feeds);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getFeedById = async (req, res) => {
    try {
        const { id } = req.params;
        const feed = await Feed.findById(id);
        if (!feed) {
            return res.status(404).json({ message: `Cannot find any feed with ID ${id}` });
        }
        res.status(200).json(feed);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getFeedBySupplierId = async (req, res) => {
    try {
        const { supplierId } = req.params;
        const feed = await Feed.find({ supplierId });
        if (!feed) {
            return res.status(404).json({ message: `Cannot find any feed with supplier ID ${id}` });
        }
        res.status(200).json(feed);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const addFeed = async (req, res) => {
    try {
        await Feed.create(req.body);
        res.status(200).json({ body: req.body, message: "Feed Added Successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateFeed = async (req, res) => {
    try {
        const { id } = req.params;
        const feed = await Feed.findByIdAndUpdate(id, req.body, { new: true });
        if (!feed) {
            return res.status(404).json({ message: `Cannot find any feed with ID ${id}` });
        }
        res.status(200).json({ feed, message: "Feed Updated Successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteFeed = async (req, res) => {
    try {
        const { id } = req.params;
        const pendingRequests = await Request.find({
            itemType: 'Feed',
            itemId: id,
            status: 'Pending'
        });

        if (pendingRequests.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete feed. There are pending requests for this feed.'
            });
        }
        const feed = await Feed.findByIdAndUpdate(id,{availableUnits:0});
        if (!feed) {
            return res.status(404).json({ message: `Cannot find any feed with ID ${id}` });
        }
        res.status(200).json({ message: "Feed Deleted Successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllFeeds, getFeedById, addFeed, updateFeed, deleteFeed, getFeedBySupplierId };