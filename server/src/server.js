import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import itemRoutes from './routes/itemRoutes.js';
import lostItemRoutes from './routes/lostItemRoutes.js';
import foundItemRoutes from './routes/foundItemRoutes.js';
import Item from './models/Item.js';
import LostItem from './models/LostItem.js';
import FoundItem from './models/FoundItem.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health Check & Welcome Endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 MERN Backend API is running!',
    dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected / Connecting',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  res.status(200).json({
    status: 'OK',
    serverTime: new Date().toISOString(),
    database: {
      status: states[dbState] || 'Unknown',
      host: mongoose.connection.host || 'N/A',
      name: mongoose.connection.name || 'N/A',
    },
  });
});

// Deep Database Verification Endpoint
app.get('/api/db-verify', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        verified: false,
        message: 'Database is not connected yet',
      });
    }

    const startTime = Date.now();
    await mongoose.connection.db.admin().ping();
    const pingLatency = Date.now() - startTime;

    const totalDocs = await Item.countDocuments();
    const collections = await mongoose.connection.db.listCollections().toArray();

    res.status(200).json({
      verified: true,
      message: 'MongoDB Atlas is online and responsive',
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      collection: 'items',
      totalDocuments: totalDocs,
      collections: collections.map((c) => c.name),
      latencyMs: pingLatency,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      verified: false,
      message: err.message,
    });
  }
});

// API Routes
app.use('/api/items', itemRoutes);
app.use('/api/lost-items', lostItemRoutes);
app.use('/api/found-items', foundItemRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server listening in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📡 Local API: http://localhost:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`💥 Unhandled Rejection: ${err.message}`);
  // Keep alive in development, exit in production
  if (process.env.NODE_ENV === 'production') {
    server.close(() => process.exit(1));
  }
});
