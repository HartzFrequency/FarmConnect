const express = require('express');
const { validateToken } = require('../authUtils');
const { getAllMedicines, getMedicineById, getMedicineBySupplierId, addMedicine, updateMedicine, deleteMedicine } = require('../controllers/medicineController');
const router = express.Router();

router.get('/getAllMedicines', validateToken, getAllMedicines);
router.get('/getMedicineById/:id', validateToken, getMedicineById);
router.post('/addMedicine', validateToken, addMedicine);
router.put('/updateMedicine/:id', validateToken, updateMedicine);
router.get('/getMedicineBySupplierId/:id', validateToken, getMedicineBySupplierId)
router.put('/deleteMedicine/:id', validateToken, deleteMedicine);

module.exports = router;