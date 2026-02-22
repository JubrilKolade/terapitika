import express, { Application, Request, Response } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import config from './config/environment';
import sequelize, { testConnection } from './config/database';
import redis from './config/redis';
import { initializeModels, syncModels } from './models';
import { initializeWebSocket } from './websocket/WebSocketManager';
import logger, { stream } from './utils/logger';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { apiRateLimiter } from './middlewares/rateLimit.middleware';

// Import routes
import authRoutes from './routes/auth.route';
import aiRoutes from './routes/ai.route';
import userRoutes from './routes/user.route';
import therapistRoutes from './routes/therapist.route';
import bookingRoutes from './routes/booking.route';
import sessionRoutes from './routes/session.route';
import chatRoutes from './routes/chat.route';
import videoRoutes from './routes/video.route';
import paymentRoutes from './routes/payment.route';
import subscriptionRoutes from './routes/subscription.route';
import reviewRoutes from './routes/review.route';
import supportRoutes from './routes/support.route';
import notificationRoutes from './routes/notification.route';
import adminRoutes from './routes/admin.route';
import analyticsRoutes from './routes/analytics.route';

/**
 * Initialize all middlewares
 */
const initializeMiddlewares = (app: Application): void => {
  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));

  // CORS configuration
  app.use(cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Cookie parser
  app.use(cookieParser(config.security.cookieSecret));

  // Compression middleware
  app.use(compression());

  // HTTP request logger
  if (config.env === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined', { stream }));
  }

  // Trust proxy
  app.set('trust proxy', 1);

  // Global rate limiter
  app.use('/api/', apiRateLimiter);
};

/**
 * Initialize all routes
 */
const initializeRoutes = (app: Application): void => {
  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.env,
    });
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/therapists', therapistRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/sessions', sessionRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/video', videoRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/subscriptions', subscriptionRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/support', supportRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/analytics', analyticsRoutes);

  // Root endpoint
  app.get('/', (req: Request, res: Response) => {
    res.json({
      name: 'Terapitika API',
      version: '1.0.0',
      description: 'AI-Powered Mental Health Platform',
      documentation: '/api/docs',
    });
  });

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);
};

/**
 * Create and configure the Express application
 */
export const createApp = (): Application => {
  const app = express();
  initializeMiddlewares(app);
  initializeRoutes(app);
  return app;
};

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
  try {
    console.log('🚀 Starting Terapitika API Server (Functional)...\n');

    // Database connection
    console.log('📊 Connecting to database...');
    await testConnection();
    initializeModels();

    if (config.env === 'development') {
      console.log('🔄 Synchronizing database models...');
      await syncModels(false);
    }

    // Redis connection
    console.log('💾 Testing Redis connection...');
    await redis.ping();
    console.log('✓ Redis connection successful\n');

    const app = createApp();
    const httpServer = createServer(app);

    // Initialize WebSocket
    console.log('🔌 Initializing WebSocket server...');
    const wsManager = initializeWebSocket(httpServer);
    (app as any).wsManager = wsManager;
    console.log('✓ WebSocket server initialized\n');

    httpServer.listen(config.port, () => {
      console.log(`✓ HTTP server is running on port ${config.port}`);
      console.log(`✓ API URL: ${config.apiUrl}`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  try {
    await sequelize.close();
    redis.disconnect();
    console.log('✓ Shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Shutdown error:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('uncaughtException', (error: Error) => {
  logger.error('UNCAUGHT EXCEPTION!', error);
  process.exit(1);
});
process.on('unhandledRejection', (reason: any) => {
  logger.error('UNHANDLED REJECTION!', reason);
  process.exit(1);
});

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

export default createApp;