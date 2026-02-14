import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
  env: string;
  port: number;
  appUrl: string;
  apiUrl: string;
  
  database: {
    url: string;
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    ssl: boolean;
  };
  
  redis: {
    url: string;
    host: string;
    port: number;
    password?: string;
  };
  
  jwt: {
    secret: string;
    refreshSecret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  
  oauth: {
    google: {
      clientId: string;
      clientSecret: string;
      callbackUrl: string;
    };
    facebook: {
      appId: string;
      appSecret: string;
      callbackUrl: string;
    };
  };
  
  ai: {
    anthropic: {
      apiKey: string;
    };
    openai: {
      apiKey: string;
    };
  };
  
  twilio: {
    accountSid: string;
    authToken: string;
    apiKey: string;
    apiSecret: string;
    phoneNumber: string;
  };
  
  stripe: {
    secretKey: string;
    publishableKey: string;
    webhookSecret: string;
  };
  
  email: {
    sendgridApiKey: string;
    fromEmail: string;
    supportEmail: string;
    smtp: {
      host: string;
      port: number;
      user: string;
      password: string;
      from: string;
    };
  };
  
  storage: {
    provider: 'aws' | 'minio';
    aws: {
      accessKeyId: string;
      secretAccessKey: string;
      bucket: string;
      region: string;
      url: string;
    };
    minio: {
      endpoint: string;
      port: number;
      accessKey: string;
      secretKey: string;
      bucket: string;
      useSSL: boolean;
    };
  };
  
  security: {
    encryptionKey: string;
    bcryptRounds: number;
    sessionSecret: string;
    cookieSecret: string;
  };
  
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  
  cors: {
    origin: string[];
    credentials: boolean;
  };
  
  features: {
    enableAiChat: boolean;
    enableVideoSessions: boolean;
    enableVoiceSessions: boolean;
    enableGuestChat: boolean;
    enableCrisisDetection: boolean;
  };
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  apiUrl: process.env.API_URL || 'http://localhost:5000',
  
  database: {
    url: process.env.DATABASE_URL || '',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'terapitika',
    user: process.env.DB_USER || 'terapitika_user',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.DB_SSL === 'true',
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'change-this-refresh-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackUrl: process.env.GOOGLE_CALLBACK_URL || '',
    },
    facebook: {
      appId: process.env.FACEBOOK_APP_ID || '',
      appSecret: process.env.FACEBOOK_APP_SECRET || '',
      callbackUrl: process.env.FACEBOOK_CALLBACK_URL || '',
    },
  },
  
  ai: {
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
    },
  },
  
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    apiKey: process.env.TWILIO_API_KEY || '',
    apiSecret: process.env.TWILIO_API_SECRET || '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  },
  
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
  
  email: {
    sendgridApiKey: process.env.SENDGRID_API_KEY || '',
    fromEmail: process.env.FROM_EMAIL || 'noreply@terapitika.com',
    supportEmail: process.env.SUPPORT_EMAIL || 'support@terapitika.com',
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      user: process.env.SMTP_USER || '',
      password: process.env.SMTP_PASSWORD || '',
      from: process.env.SMTP_FROM || 'noreply@terapitika.com',
    },
  },
  
  storage: {
    provider: (process.env.STORAGE_PROVIDER as 'aws' | 'minio') || 'minio',
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      bucket: process.env.AWS_S3_BUCKET || '',
      region: process.env.AWS_REGION || 'us-east-1',
      url: process.env.AWS_S3_URL || '',
    },
    minio: {
      endpoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000', 10),
      accessKey: process.env.MINIO_ACCESS_KEY || '',
      secretKey: process.env.MINIO_SECRET_KEY || '',
      bucket: process.env.MINIO_BUCKET || 'terapitika',
      useSSL: process.env.MINIO_USE_SSL === 'true',
    },
  },
  
  security: {
    encryptionKey: process.env.ENCRYPTION_KEY || '',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
    sessionSecret: process.env.SESSION_SECRET || 'change-this-session-secret',
    cookieSecret: process.env.COOKIE_SECRET || 'change-this-cookie-secret',
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },
  
  features: {
    enableAiChat: process.env.ENABLE_AI_CHAT !== 'false',
    enableVideoSessions: process.env.ENABLE_VIDEO_SESSIONS !== 'false',
    enableVoiceSessions: process.env.ENABLE_VOICE_SESSIONS !== 'false',
    enableGuestChat: process.env.ENABLE_GUEST_CHAT !== 'false',
    enableCrisisDetection: process.env.ENABLE_CRISIS_DETECTION !== 'false',
  },
};

// Validate required environment variables
function validateConfig(): void {
  const requiredVars = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'ENCRYPTION_KEY',
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0 && config.env === 'production') {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

validateConfig();

export default config;