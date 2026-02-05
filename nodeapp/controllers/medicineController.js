const Medicine = require('../models/medicineModel');
const Request = require('../models/requestModel');

const getAllMedicines = async (req, res) => {
    try {
        const allMedicines = await Medicine.find().populate('supplierId', 'userName email');
        const medicines = allMedicines.filter((medicine)=>medicine.availableUnits>0);
        return res.status(200).json(medicines);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getMedicineById = async (req, res) => {
    try {
        const { id } = req.params;
        const medicine = await Medicine.findById(id).populate('supplierId', 'userName email');;
        if (!medicine) {
            return res.status(404).json({ message: `Cannot find any medicine with ID ${id}` });
        }
        return res.status(200).json(medicine);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const addMedicine = async (req, res) => {
    try {
        await Medicine.create(req.body);
        return res.status(200).json({ message: 'Medicine Added Successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const updateMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        const { medicineName, type, description, dosage, pricePerUnit, unit, manufacturer, expiryDate, availableUnits } = req.body;

        const medicine = await Medicine.findByIdAndUpdate(
            id,
            { medicineName, type, description, dosage, pricePerUnit, unit, manufacturer, expiryDate, availableUnits },
            { new: true, runValidators: true }
        );

        if (!medicine) {
            return res.status(404).json({ message: `Cannot find any medicine with ID ${id}` });
        }

        res.status(200).json({ message: 'Medicine Updated Successfully', medicine });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getMedicineBySupplierId = async (req, res) => {
    try {
        const { id } = req.params;
        const medicine = await Medicine.find({ supplierId:id });
        if (!medicine) {
            return res.status(404).json({ message: `Cannot find any medicine with supplier ID ${id}` });
        }
        res.status(200).json(medicine);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        const pendingRequests = await Request.find({
            itemType: 'Medicine',
            itemId: id,
            status: 'Pending'
        });

        if (pendingRequests.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete medicine. There are pending requests for this medicine.'
            });
        }

        const medicine = await Medicine.findByIdAndUpdate(id,{availableUnits:0});

        if (!medicine) {
            return res.status(404).json({ message: `Cannot find any medicine with ID ${id}` });
        }
        res.status(200).json({ message: 'Medicine Deleted Successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


module.exports = { getAllMedicines, getMedicineById, getMedicineBySupplierId, addMedicine, updateMedicine, deleteMedicine };