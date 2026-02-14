# Terapitika Backend API

Production-ready REST API for the Terapitika mental health platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 15+
- Redis 7+

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Development

```bash
# Start PostgreSQL and Redis (with Docker)
docker-compose up -d postgres redis

# Run database migrations (if using migrations)
npm run db:migrate

# Start development server with hot reload
npm run dev
```

The server will start on `http://localhost:5000`

## 📋 Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
npm run type-check   # TypeScript type checking
npm run test         # Run tests
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with test data
```

## 🔌 API Endpoints

### Health Check
```
GET /health          # Server health status
GET /                # API information
```

### Authentication (`/api/auth`)
```
POST /register               # Register new user
POST /login                  # Login with email/password
POST /logout                 # Logout (requires auth)
POST /refresh                # Refresh access token (requires auth)
POST /forgot-password        # Request password reset
POST /reset-password         # Reset password with token
POST /change-password        # Change password (requires auth)
POST /verify-email           # Verify email with token
POST /send-verification      # Send verification email (requires auth)
GET  /me                     # Get current user (requires auth)
GET  /status                 # Check auth status
GET  /google/callback        # Google OAuth callback
GET  /facebook/callback      # Facebook OAuth callback
```

## 🔐 Authentication

### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "phone": "(555) 123-4567"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

### Using Access Token
```bash
GET /api/auth/me
Authorization: Bearer <your-access-token>
```

## 🗄️ Database Models

- **User** - User accounts (clients, therapists, admins)
- **Therapist** - Therapist profiles and credentials
- **Session** - Therapy sessions (AI and human)
- **Message** - Chat messages (encrypted)
- **GuestSession** - Anonymous chat sessions

## 🔒 Security Features

- **JWT Authentication** - Access tokens (15min) + Refresh tokens (7 days)
- **Password Hashing** - Bcrypt with 10 rounds
- **AES-256 Encryption** - For sensitive data (HIPAA compliant)
- **Rate Limiting** - Prevents abuse and DDoS
- **CORS Protection** - Configured allowed origins
- **Helmet.js** - Security headers
- **Input Validation** - All endpoints validated
- **Audit Logging** - HIPAA-compliant audit trails

## 📊 Rate Limits

- **Auth Endpoints**: 5 requests per 15 minutes
- **Password Reset**: 3 requests per hour
- **General API**: 100 requests per 15 minutes
- **AI Chat**: 10 requests per minute
- **File Upload**: 20 requests per hour

## 🔧 Environment Variables

Required variables in `.env`:

```bash
# Application
NODE_ENV=development
PORT=5000
APP_URL=http://localhost:3000
API_URL=http://localhost:5000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/terapitika

# Redis
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
ENCRYPTION_KEY=your-32-byte-encryption-key

# Optional: OAuth, AI, Payment services
# See .env.example for full list
```

## 🏗️ Project Structure

```
src/
├── config/          # Configuration files
│   ├── database.ts
│   ├── redis.ts
│   ├── environment.ts
│   └── jwt.ts
├── models/          # Database models
│   ├── user.model.ts
│   ├── therapist.model.ts
│   ├── session.model.ts
│   ├── message.model.ts
│   └── index.ts
├── controllers/     # Route controllers
│   └── auth.controller.ts
├── services/        # Business logic
│   └── auth.service.ts
├── middleware/      # Express middleware
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   ├── rateLimit.middleware.ts
│   └── validation.middleware.ts
├── routes/          # API routes
│   └── auth.routes.ts
├── utils/           # Utilities
│   ├── logger.ts
│   ├── encryption.ts
│   ├── validation.ts
│   └── helpers.ts
├── types/           # TypeScript types
│   └── index.ts
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🐳 Docker

```bash
# Start all services (PostgreSQL, Redis, Backend)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## 🔍 Logging

Logs are stored in `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only
- `audit.log` - HIPAA audit trail

## 🚦 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error

## 🔐 HIPAA Compliance

- ✅ Encrypted data at rest (AES-256)
- ✅ Encrypted data in transit (TLS 1.3)
- ✅ Audit logging of all PHI access
- ✅ Access controls (RBAC)
- ✅ Session management
- ✅ Automatic logout
- ✅ Password requirements enforced

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL is running
pg_isready

# Check connection string in .env
echo $DATABASE_URL
```

### Redis Connection Failed
```bash
# Check Redis is running
redis-cli ping

# Should return: PONG
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

## 📚 Next Steps

1. ✅ Authentication system working
2. 🔄 Add more endpoints (users, therapists, sessions)
3. 🔄 Integrate AI service (Claude API)
4. 🔄 Add WebSocket for real-time chat
5. 🔄 Integrate payment system (Stripe)
6. 🔄 Add email/SMS services

## 📞 Support

For issues or questions, please check the documentation or create an issue in the repository.

---

Built with ❤️ for better mental health access