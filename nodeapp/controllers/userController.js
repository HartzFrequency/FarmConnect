const User = require('../models/userModel.js');
const { generateToken } = require('../authUtils.js');
const logger = require('../utils/logger');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    // service: 'gmail', 
    host: 'smtp.gmail.com',
    port: 465,  
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const addUser = async (req, res) => {
    try {
        const { email } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        await User.create(req.body);
        return res.status(200).json({ message: 'Success' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function getUserByEmailAndPassword(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await user.validatePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(user._id);
        return res.status(200).json({
            id: user._id,
            userName: user.userName,
            role: user.role,
            token,
            message: 'Login successful'
        });
    } catch (err) {
        logger.error('Login error:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: `User with ${email} not found.` });
        }
        const otp = (crypto.randomInt(1000, 9999)).toString();

        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        await transporter.sendMail({
            from: `"FarmConnect" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset OTP',
            html: `
              <!DOCTYPE html>
              <html>
              <body style="font-family: Arial, sans-serif; background-color: #ffffff; color: #333; padding: 20px;">
                <div style="max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #fff;">
                  <h2 style="text-align: center; color: #28a745; margin-bottom: 10px;">FarmConnect</h2>
                  <p style="font-size: 16px; line-height: 1.5; text-align: center;">
                    You requested to reset your password. Please use the OTP below to proceed:
                  </p>
                  <div style="text-align: center; margin: 20px 0;">
                    <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #28a745; padding: 10px 20px; border: 2px dashed #28a745; border-radius: 6px;">
                      ${otp}
                    </span>
                  </div>
                  <p style="font-size: 14px; text-align: center; color: #555;">
                    This OTP is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.
                  </p>
                  <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
                  <p style="font-size: 12px; text-align: center; color: #999;">
                    &copy; 2025 FarmConnect. All rights reserved.
                  </p>
                </div>
              </body>
              </html>
            `
        });
        return res.status(200).json({ message: 'OTP sent successfully to email' });
    } catch (error) {
        logger.error('Send OTP error:', error);
        return res.status(500).json({ message: 'Failed to send OTP' });
    }
};

const resetPasswordWithOtp = async (req, res) => {
    try {
        const { email, otp, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: `User with ${email} not found.` });
        }

        if (!user.otp || !user.otpExpires) {
            return res.status(400).json({ message: 'OTP not requested' });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        user.password = password;
        user.otp = undefined;
        user.otpExpires = undefined;

        await user.save();

        return res.status(200).json({ message: 'Password updated successfully using OTP' });
    } catch (error) {
        logger.error('Reset password with OTP error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { addUser, getUserByEmailAndPassword, sendOtp, resetPasswordWithOtp };