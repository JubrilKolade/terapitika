import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import fs from 'node:fs/promises';
import path from 'node:path';
import config from './config/environment';
import { stream } from './utils/logger';
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

  // Minimal OpenAPI spec endpoint (placeholder until fully documented)
  app.get('/api/docs', async (_req: Request, res: Response) => {
    const candidates = [
      // when running from repo root
      path.join(process.cwd(), 'docs', 'api', 'openapi.yaml'),
      // when running from backend/ as CWD
      path.join(process.cwd(), '..', 'docs', 'api', 'openapi.yaml'),
    ];

    for (const p of candidates) {
      try {
        const spec = await fs.readFile(p, 'utf8');
        res.type('text/yaml').send(spec);
        return;
      } catch {
        // try next path
      }
    }

    res.status(501).json({
      message: 'OpenAPI spec not available yet.',
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

export default createApp;