const router = require('express').Router();

const { getAllLivestock, getLivestockById, getLivestockByUserId, addLivestock, updateLivestock, deleteLivestock } = require('../controllers/liveStockController');
const { validateToken } = require('../authUtils');

router.get('/getAllLivestock', validateToken, getAllLivestock);
router.get('/getLivestockById/:id', validateToken, getLivestockById);
router.get('/getLivestockByUser/:userId', validateToken, getLivestockByUserId);
router.post('/addLivestock', validateToken, addLivestock);
router.put('/updateLivestock/:id', validateToken, updateLivestock);
router.delete('/deleteLivestock/:id', validateToken, deleteLivestock);

module.exports = router;
