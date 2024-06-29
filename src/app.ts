import { Application } from 'express';
import urlRoutes from './routes/urlRoutes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import setupSwagger from './config/swagger';
import mongoose from 'mongoose';
const cors = require('cors')


const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv'); // Use require instead of import

dotenv.config();

const app: Application = express();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/url-shortener';

// Connect to MongoDB
mongoose.connect(MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

app.use(cors())

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/v1', urlRoutes);

setupSwagger(app);

// Error Middleware
app.use(errorMiddleware);




export default app;
