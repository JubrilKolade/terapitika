import { createServer } from 'http';
import config from './config/environment';
import sequelize, { testConnection } from './config/database';
import redis from './config/redis';
import { initializeModels, syncModels } from './models';
import { initializeWebSocket } from './websocket/WebSocketManager';
import logger from './utils/logger';
import { createApp } from './app';

let httpServer: ReturnType<typeof createServer> | null = null;

const startServer = async (): Promise<void> => {
  try {
    console.log('🚀 Starting Terapitika API Server...\n');

    console.log('📊 Connecting to database...');
    await testConnection();
    initializeModels();

    if (config.env === 'development') {
      console.log('🔄 Synchronizing database models...');
      await syncModels(false);
    }

    console.log('💾 Testing Redis connection...');
    await redis.ping();
    console.log('✓ Redis connection successful\n');

    const app = createApp();
    httpServer = createServer(app);

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

const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  try {
    if (httpServer) {
      await new Promise<void>((resolve) => httpServer!.close(() => resolve()));
    }
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

startServer();

