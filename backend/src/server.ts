import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter, strictLimiter } from './middleware/rateLimiter.js';
import productionPlanRoutes from './routes/productionPlanRoutes.js';
import geminiRoutes from './routes/geminiRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

// Load environment variables
// dotenv.config() automatically looks for .env in the current working directory
// When running from backend directory, it will find backend/.env
dotenv.config();

// Log API key status (without exposing the key)
if (process.env.GEMINI_API_KEY) {
  console.log('✅ GEMINI_API_KEY loaded (length:', process.env.GEMINI_API_KEY.length, ')');
} else {
  console.error('❌ GEMINI_API_KEY not found!');
  console.error('Make sure you are running from the backend directory and .env file exists');
}

// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDatabase();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Parse JSON bodies (large limit for base64 images)
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
app.use('/api/', apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/production-plans', productionPlanRoutes);
app.use('/api/gemini', strictLimiter, geminiRoutes); // Stricter rate limit for AI generation
app.use('/api/chat', chatRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║   🚀 Story Arc Engine Backend Server         ║
║                                               ║
║   Status: Running                             ║
║   Port: ${PORT}                                  ║
║   Environment: ${process.env.NODE_ENV || 'development'}                   ║
║                                               ║
╚═══════════════════════════════════════════════╝
  `);
});

// Handle port conflicts
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`
❌ Error: Port ${PORT} is already in use.

To fix this, you can:
1. Kill the process using port ${PORT}:
   lsof -ti:${PORT} | xargs kill -9

2. Or change the PORT in your .env file to a different port (e.g., 5002, 5003)
    `);
    process.exit(1);
  } else {
    console.error('❌ Server error:', error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;
