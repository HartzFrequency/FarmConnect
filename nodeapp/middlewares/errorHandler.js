const logger = require('../utils/logger');

const errorHandler = (err, _req, res, _next) => {
    logger.error(err.message);
    res.status(err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
}

module.exports = errorHandler;