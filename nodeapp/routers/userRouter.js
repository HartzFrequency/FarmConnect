const router = require('express').Router();
const { addUser, getUserByEmailAndPassword, sendOtp, resetPasswordWithOtp } = require('../controllers/userController');

router.post('/signup', addUser);
router.post('/login', getUserByEmailAndPassword);
router.post('/forgotPassword',sendOtp);
router.post('/resetPasswordWithOtp',resetPasswordWithOtp);

module.exports = router;