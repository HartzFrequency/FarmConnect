const Feedback = require('../models/feedbackModel');

const addFeedback = async (req, res) => {
    try {
        await Feedback.create(req.body);
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getFeedbacksBySupplier = async (req, res) => {
    try {
        const { supplierId } = req.params;
        const feedbacks = await Feedback.find({ supplierId })
            .populate('itemId')
            .populate('userId', 'userName email');
        res.status(200).json(feedbacks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findByIdAndDelete(id);
        if (!feedback) {
            return res.status(404).json({ message: `Feedback with ID ${id} not found` });
        }
        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    addFeedback,
    getFeedbacksBySupplier,
    deleteFeedback
};