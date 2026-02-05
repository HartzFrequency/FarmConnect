require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');
const cors = require('cors');

const userRouter = require('./routers/userRouter');
const requestRouter = require('./routers/requestRouter');
const liveStockRouter = require('./routers/liveStockRouter');
const feedRouter = require('./routers/feedRouter');
const feedbackRouter = require('./routers/feedbackRouter');
const medicineRouter = require('./routers/medicineRouter');
const errorHandler = require('./middlewares/errorHandler');

const logStream = fs.createWriteStream(path.join(__dirname, 'logs', 'combine.log'), { flags: 'a' });

const app = express();
app.disable('x-powered-by');
app.use(express.json({limit:'5mb'}))

app.use(morgan('dev', {
    stream: logStream
}));

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['content-type', 'authorization'],
    exposedHeaders: ['content-type']
}));


app.use('/api/v1/user', userRouter);
app.use('/api/v1/feed', feedRouter);
app.use('/api/v1/request', requestRouter);
app.use('/api/v1/liveStock', liveStockRouter);
app.use('/api/v1/feedback', feedbackRouter);
app.use('/api/v1/medicine', medicineRouter);

app.use(errorHandler);

connectDB()
    .then(() => {
        logger.info('Database connected successfully');
        app.listen(process.env.SERVER_PORT, () => logger.info(`Server running at ${process.env.SERVER_PORT}`));
    })
    .catch((error) => {
        logger.error(error.message);
        process.exit(0);
    })