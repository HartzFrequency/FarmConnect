const jwt = require('jsonwebtoken');

const secretKey = 'asdfgewlnclnlhjkl'
const generateToken = (userId) => jwt.sign({ userId }, secretKey, { expiresIn: '1h' });

const validateToken = (req, res, next) => {
    const authToken = req.headers.authorization;
    if (!authToken || !authToken.startsWith('Bearer')) {
        return res.status(400).json({ message: "Authentication failed" });
    }
    const token = authToken.substring(7);
    try {
        jwt.verify(token, secretKey);
        next();
    }
    catch (error) {
        console.error("JWT verification error:", error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = { generateToken, validateToken };