const { getAllFeeds, getFeedById, getFeedBySupplierId, addFeed, updateFeed, deleteFeed } = require('../controllers/feedController');
const { validateToken } = require('../authUtils');
const router = require('express').Router();

router.get('/getAllFeeds', validateToken, getAllFeeds);
router.get('/getFeedById/:id', validateToken, getFeedById);
router.get('/getFeedBySupplierId/:supplierId', validateToken, getFeedBySupplierId);
router.post('/addFeed', validateToken, addFeed);
router.put('/updateFeed/:id', validateToken, updateFeed);
router.put('/deleteFeed/:id', validateToken, deleteFeed);

module.exports = router;