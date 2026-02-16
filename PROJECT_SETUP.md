# Terapitika - Project Setup Guide

## Project Structure

```
terapitika/
├── README.md
├── ARCHITECTURE.md
├── PAGES_STRUCTURE.md
├── .gitignore
├── docker-compose.yml
├── .env.example
│
├── frontend/                    # Next.js Frontend
│   ├── public/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── src/
│   │   ├── app/                # Next.js 14 App Router
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── layout.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── profile/
│   │   │   │   ├── settings/
│   │   │   │   └── layout.tsx
│   │   │   ├── (therapist)/
│   │   │   │   └── therapist-portal/
│   │   │   ├── (admin)/
│   │   │   │   └── admin/
│   │   │   ├── chat/
│   │   │   ├── therapists/
│   │   │   ├── session/
│   │   │   ├── support/
│   │   │   ├── guest-chat/
│   │   │   ├── about/
│   │   │   ├── pricing/
│   │   │   ├── api/            # API routes
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx        # Landing page
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   ├── auth/
│   │   │   ├── chat/
│   │   │   ├── therapist/
│   │   │   ├── booking/
│   │   │   ├── session/
│   │   │   ├── admin/
│   │   │   ├── layout/
│   │   │   └── shared/
│   │   ├── lib/
│   │   │   ├── utils.ts
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── websocket.ts
│   │   │   ├── webrtc.ts
│   │   │   └── constants.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useWebSocket.ts
│   │   │   ├── useWebRTC.ts
│   │   │   ├── useChat.ts
│   │   │   └── useTherapist.ts
│   │   ├── store/              # Zustand store
│   │   │   ├── authStore.ts
│   │   │   ├── chatStore.ts
│   │   │   └── sessionStore.ts
│   │   ├── types/
│   │   │   ├── user.ts
│   │   │   ├── therapist.ts
│   │   │   ├── session.ts
│   │   │   └── message.ts
│   │   └── styles/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── .env.local
│
├── backend/                     # Node.js Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├── redis.ts
│   │   │   ├── jwt.ts
│   │   │   └── environment.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── therapist.controller.ts
│   │   │   ├── session.controller.ts
│   │   │   ├── booking.controller.ts
│   │   │   ├── chat.controller.ts
│   │   │   ├── payment.controller.ts
│   │   │   ├── ai.controller.ts
│   │   │   └── admin.controller.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── therapist.service.ts
│   │   │   ├── session.service.ts
│   │   │   ├── booking.service.ts
│   │   │   ├── chat.service.ts
│   │   │   ├── ai.service.ts
│   │   │   ├── email.service.ts
│   │   │   ├── sms.service.ts
│   │   │   ├── video.service.ts
│   │   │   ├── payment.service.ts
│   │   │   ├── crisis.service.ts
│   │   │   └── storage.service.ts
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── therapist.model.ts
│   │   │   ├── session.model.ts
│   │   │   ├── message.model.ts
│   │   │   └── index.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── rbac.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   ├── rateLimit.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── audit.middleware.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── therapist.routes.ts
│   │   │   ├── session.routes.ts
│   │   │   ├── booking.routes.ts
│   │   │   ├── chat.routes.ts
│   │   │   ├── video.routes.ts
│   │   │   ├── payment.routes.ts
│   │   │   ├── ai.routes.ts
│   │   │   ├── support.routes.ts
│   │   │   ├── admin.routes.ts
│   │   │   └── index.ts
│   │   ├── websocket/
│   │   │   ├── chatHandler.ts
│   │   │   ├── videoHandler.ts
│   │   │   └── presenceHandler.ts
│   │   ├── utils/
│   │   │   ├── encryption.ts
│   │   │   ├── validation.ts
│   │   │   ├── logger.ts
│   │   │   └── helpers.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── db/
│   │   │   ├── migrations/
│   │   │   ├── seeds/
│   │   │   └── schema.sql
│   │   ├── app.ts
│   │   └── server.ts
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
│   └── nodemon.json
│
├── ai-service/                  # Separate AI microservice (optional)
│   ├── src/
│   │   ├── models/
│   │   ├── services/
│   │   └── index.ts
│   ├── requirements.txt         # If using Python
│   └── Dockerfile
│
├── docs/                        # Documentation
│   ├── api/
│   │   └── openapi.yaml
│   ├── guides/
│   ├── diagrams/
│   └── deployment/
│
├── scripts/                     # Utility scripts
│   ├── setup.sh
│   ├── migrate.sh
│   ├── seed.sh
│   └── deploy.sh
│
└── infrastructure/              # Infrastructure as Code
    ├── terraform/
    ├── kubernetes/
    └── docker/
```

---

## Initial Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (for local development)

### 1. Clone and Setup

```bash
# Create project directory
mkdir terapitika
cd terapitika

# Initialize git
git init
```

### 2. Frontend Setup

```bash
# Create Next.js app
npx create-next-app@latest frontend --typescript --tailwind --app --src-dir --import-alias "@/*"

cd frontend

# Install dependencies
npm install zustand react-hook-form zod @hookform/resolvers
npm install socket.io-client simple-peer
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install lucide-react class-variance-authority clsx tailwind-merge
npm install react-query axios
npm install date-fns recharts

# Dev dependencies
npm install -D @types/node @types/react
```

### 3. Backend Setup

```bash
cd ../

# Create backend directory
mkdir backend
cd backend

# Initialize package.json
npm init -y

# Install dependencies
npm install express cors dotenv
npm install pg pg-hstore sequelize
npm install redis ioredis
npm install jsonwebtoken bcrypt
npm install socket.io
npm install @anthropic-ai/sdk
npm install stripe twilio nodemailer
npm install helmet express-rate-limit
npm install winston morgan
npm install joi celebrate
npm install multer aws-sdk

# TypeScript dependencies
npm install -D typescript @types/node @types/express
npm install -D @types/cors @types/bcrypt @types/jsonwebtoken
npm install -D ts-node nodemon
npm install -D @types/multer

# Initialize TypeScript
npx tsc --init
```

### 4. Database Setup

```bash
# Install PostgreSQL (if not already installed)
# macOS
brew install postgresql@15

# Ubuntu/Debian
sudo apt-get install postgresql-15

# Start PostgreSQL
brew services start postgresql@15  # macOS
sudo service postgresql start       # Linux

# Create database
psql postgres
CREATE DATABASE terapitika;
CREATE USER terapitika_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE terapitika TO terapitika_user;
\q

# Install Redis
brew install redis              # macOS
sudo apt-get install redis      # Linux

# Start Redis
brew services start redis       # macOS
sudo service redis-server start # Linux
```

### 5. Docker Compose Setup

```bash
# Create docker-compose.yml in project root
cd ..
touch docker-compose.yml
```

### 6. Environment Variables

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your values

# Frontend
cd ../frontend
cp .env.local.example .env.local
# Edit .env.local with your values
```

### 7. Database Migrations

```bash
cd backend

# Install Sequelize CLI
npm install -D sequelize-cli

# Initialize Sequelize
npx sequelize-cli init

# Create migration
npx sequelize-cli migration:generate --name create-users-table

# Run migrations
npx sequelize-cli db:migrate
```

### 8. Start Development Servers

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev

# Terminal 3: Start Redis (if not running as service)
redis-server

# Terminal 4: Start PostgreSQL (if not running as service)
postgres -D /usr/local/var/postgres
```

---

## Git Setup

```bash
# Create .gitignore
cat > .gitignore << EOF
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
*.log

# Next.js
.next/
out/
build/
dist/

# Env files
.env
.env.local
.env.*.local

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Misc
*.pem
.vercel
EOF

# Initial commit
git add .
git commit -m "Initial project setup"
```

---

## Development Workflow

### Daily Development
1. Pull latest changes: `git pull origin main`
2. Create feature branch: `git checkout -b feature/your-feature`
3. Start dev servers (see step 8 above)
4. Make changes
5. Test changes
6. Commit: `git commit -m "Description"`
7. Push: `git push origin feature/your-feature`
8. Create Pull Request

### Testing
```bash
# Backend tests
cd backend
npm run test
npm run test:watch
npm run test:coverage

# Frontend tests
cd frontend
npm run test
npm run test:e2e
```

### Code Quality
```bash
# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check

# Formatting (Prettier)
npm run format
```

---

## Deployment Preparation

### Production Build
```bash
# Frontend
cd frontend
npm run build
npm run start

# Backend
cd backend
npm run build
npm run start:prod
```

### Docker Build
```bash
# Build images
docker-compose build

# Start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### Database Backup
```bash
# Backup
pg_dump -U terapitika_user terapitika > backup.sql

# Restore
psql -U terapitika_user terapitika < backup.sql
```

---

## Monitoring Setup

### Application Monitoring
- Install DataDog agent
- Configure Sentry for error tracking
- Set up New Relic APM

### Log Management
- Configure Winston for structured logging
- Set up log rotation
- Implement ELK stack for log aggregation

---

## Security Checklist

- [ ] Environment variables properly configured
- [ ] HTTPS/TLS enabled in production
- [ ] Database connections encrypted
- [ ] JWT secrets rotated regularly
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using ORM)
- [ ] XSS protection
- [ ] CSRF protection
- [ ] CORS properly configured
- [ ] Helmet.js security headers
- [ ] Dependencies audited (`npm audit`)
- [ ] Secrets not committed to git
- [ ] API keys encrypted in database
- [ ] User passwords hashed with bcrypt
- [ ] Session management secure
- [ ] File upload validation
- [ ] WebSocket authentication
- [ ] HIPAA compliance measures

---

## Next Steps

1. **Week 1-2**: Core infrastructure
   - Database schema implementation
   - Authentication system
   - Basic API endpoints
   - WebSocket setup

2. **Week 3-4**: Core features
   - User registration/login
   - Profile management
   - AI chat integration
   - Basic UI components

3. **Week 5-6**: Therapist features
   - Therapist registration
   - Profile creation
   - Availability management
   - Booking system

4. **Week 7-8**: Session features
   - Video/voice integration
   - Chat interface
   - Session management
   - Payment integration

5. **Week 9-10**: Advanced features
   - Crisis detection system
   - Admin panel
   - Analytics
   - Support system

6. **Week 11-12**: Testing & deployment
   - Comprehensive testing
   - Performance optimization
   - Security audit
   - Production deployment

---

This setup guide provides everything needed to get started with Terapitika development!
