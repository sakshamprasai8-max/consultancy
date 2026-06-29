import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';

// Route Imports
import authRoutes from './routes/auth';
import countryRoutes from './routes/countries';
import universityRoutes from './routes/universities';
import scholarshipRoutes from './routes/scholarships';
import blogRoutes from './routes/blog';
import eventRoutes from './routes/events';
import reviewRoutes from './routes/reviews';
import contactRoutes from './routes/contact';
import appointmentRoutes from './routes/appointments';
import studentRoutes from './routes/student';
import adminRoutes from './routes/admin';
import leadRoutes from './routes/leads';
import uploadRoutes from './routes/upload';

// Middleware Imports
import { generalLimiter } from './middleware/rateLimiter';

// Load Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and Utility Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows displaying local files / images in frontend
}));

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all requests
app.use(generalLimiter);

// Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Server is healthy and running.' });
});

// Map API Routes
app.use('/api/auth', authRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/upload', uploadRoutes);

// Optional static uploads directory serve (fallback)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 404 Route handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'API Endpoint not found.' });
});

// Global Error Handling Middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(` EduConsult Pro backend running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(` API Endpoint: http://localhost:${PORT}/api`);
  console.log(`=============================================`);
});
