const router = require('express').Router();
const { getAllRequests, getRequestById, getAllRequestsBySupplier, getRequestsByUserId, addRequest, updateRequest, deleteRequest } = require('../controllers/requestController');
const { validateToken } = require('../authUtils')

router.get('/getAllRequests', validateToken, getAllRequests);
router.get('/getRequestById/:id', validateToken, getRequestById);
router.get('/getAllRequestsBySupplier/:supplierId', validateToken, getAllRequestsBySupplier);
router.get('/getRequestsByUserId/:userId', validateToken, getRequestsByUserId);
router.post('/addRequest', validateToken, addRequest);
router.put('/updateRequest/:id', validateToken, updateRequest);
router.delete('/deleteRequest/:id', validateToken, deleteRequest);

module.exports = router;