import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import urlRoutes from './routes/urlRoutes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { swaggerDocs } from './config/swagger';

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/v1', urlRoutes);

// Error Middleware
app.use(errorMiddleware);

const PORT = Number(process.env.PORT || 3000);
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/url-shortener';

// Connect to MongoDB
mongoose.connect(MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Swagger Documentation
swaggerDocs(app, PORT);

export default app;
