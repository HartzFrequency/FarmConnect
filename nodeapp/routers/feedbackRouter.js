const express = require('express');
const {
    addFeedback,
    getFeedbacksBySupplier,
    deleteFeedback
} = require('../controllers/feedbackController');

const { validateToken } = require('../authUtils')

const router = express.Router();

router.post('/addFeedback', validateToken, addFeedback);
router.get('/supplier/:supplierId', validateToken, getFeedbacksBySupplier);
router.delete('/deleteFeedback/:id', validateToken, deleteFeedback);

module.exports = router;