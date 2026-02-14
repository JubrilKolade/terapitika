# Terapitika 🧠

> AI-Powered Mental Health Platform - Professional Therapy Meets Cutting-Edge Technology

Terapitika is a comprehensive mental health platform that combines AI-powered therapeutic support with licensed human therapists, offering seamless text, voice, and video communication channels.

---

## 🌟 Features

### For Clients
- **24/7 AI Support**: Instant access to AI-powered therapy companion
- **Licensed Therapists**: Connect with verified, licensed mental health professionals
- **Multi-Modal Communication**: Chat, voice, and video sessions
- **Guest Access**: Try AI chat without registration (limited)
- **Crisis Detection**: Advanced AI system to detect and respond to crisis situations
- **Secure & Private**: HIPAA-compliant infrastructure with end-to-end encryption
- **Flexible Scheduling**: Easy booking with calendar integration
- **Progress Tracking**: Monitor your mental health journey with analytics

### For Therapists
- **Professional Dashboard**: Manage clients, sessions, and schedule
- **Session Management**: Video, voice, and chat capabilities
- **Client Insights**: AI-generated summaries and session analytics
- **Flexible Availability**: Set your own schedule and rates
- **Secure Payments**: Automated billing and payouts via Stripe
- **Verification System**: Streamlined license verification process
- **Client Notes**: Encrypted progress notes and treatment plans

### For Administrators
- **Analytics Dashboard**: Comprehensive platform metrics
- **User Management**: Manage users, therapists, and permissions
- **Crisis Monitoring**: Real-time crisis detection and response
- **Payment Oversight**: Transaction monitoring and financial reports
- **Support System**: Integrated ticketing and support management

---

## 🏗️ Architecture

### Technology Stack

#### Frontend
- **Framework**: Next.js 14 (React 18+, TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Real-time**: Socket.io-client
- **Video/Voice**: WebRTC (Simple-peer) + Twilio

#### Backend
- **Framework**: Node.js + Express (TypeScript)
- **Database**: PostgreSQL 15+
- **Cache**: Redis
- **ORM**: Sequelize
- **Real-time**: Socket.io
- **Authentication**: JWT + OAuth2

#### AI & Services
- **Primary LLM**: Anthropic Claude API
- **Speech-to-Text**: Google Cloud Speech
- **Text-to-Speech**: Google Cloud / ElevenLabs
- **Video Infrastructure**: Twilio Video
- **Payments**: Stripe
- **Email**: SendGrid
- **Storage**: AWS S3 / MinIO (dev)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: 18.0 or higher
- **npm**: 9.0 or higher
- **PostgreSQL**: 15 or higher
- **Redis**: 7 or higher
- **Docker** and **Docker Compose** (for containerized development)

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/terapitika.git
cd terapitika
```

### 2. Environment Setup

#### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
npm install
```

#### Frontend
```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local with your configuration
npm install
```

### 3. Database Setup

#### Option A: Using Docker (Recommended)
```bash
# From project root
docker-compose up -d postgres redis

# Wait for services to be healthy
docker-compose ps

# Run migrations
cd backend
npm run db:migrate
npm run db:seed
```

#### Option B: Manual Setup
```bash
# Create database
createdb terapitika

# Run migrations
cd backend
npm run db:migrate
npm run db:seed
```

### 4. Start Development Servers

#### Using Docker Compose
```bash
# From project root
docker-compose up
```

Access the services:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **pgAdmin**: http://localhost:5050
- **Redis Commander**: http://localhost:8081
- **MinIO Console**: http://localhost:9001
- **MailHog**: http://localhost:8025

#### Manual Start
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Redis (if not running as service)
redis-server

# Terminal 4: PostgreSQL (if not running as service)
postgres -D /path/to/data
```

---

## 📁 Project Structure

```
terapitika/
├── frontend/              # Next.js frontend application
│   ├── src/
│   │   ├── app/          # Next.js App Router
│   │   ├── components/   # React components
│   │   ├── lib/          # Utility functions
│   │   ├── hooks/        # Custom React hooks
│   │   ├── store/        # Zustand state management
│   │   └── types/        # TypeScript types
│   └── package.json
│
├── backend/              # Node.js/Express backend
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── services/     # Business logic
│   │   ├── models/       # Database models
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API routes
│   │   ├── websocket/    # WebSocket handlers
│   │   ├── utils/        # Utility functions
│   │   └── db/           # Database migrations & seeds
│   └── package.json
│
├── docs/                 # Documentation
├── scripts/              # Utility scripts
├── docker-compose.yml    # Docker orchestration
└── README.md
```

---

## 🔧 Configuration

### Required API Keys

You'll need to obtain API keys for the following services:

1. **Anthropic Claude** (AI Chat)
   - Sign up at: https://console.anthropic.com/
   - Get API key
   - Set `ANTHROPIC_API_KEY` in backend `.env`

2. **Stripe** (Payments)
   - Sign up at: https://stripe.com/
   - Get test keys from dashboard
   - Set `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`

3. **Twilio** (Video/Voice/SMS)
   - Sign up at: https://www.twilio.com/
   - Get Account SID and Auth Token
   - Set in backend `.env`

4. **Google Cloud** (Speech Services)
   - Create project at: https://console.cloud.google.com/
   - Enable Speech-to-Text and Text-to-Speech APIs
   - Download service account key
   - Set `GOOGLE_APPLICATION_CREDENTIALS` path

5. **SendGrid** (Email)
   - Sign up at: https://sendgrid.com/
   - Create API key
   - Set `SENDGRID_API_KEY`

---

## 🧪 Testing

### Run Unit Tests
```bash
# Backend
cd backend
npm run test
npm run test:coverage

# Frontend
cd frontend
npm run test
npm run test:coverage
```

### Run E2E Tests
```bash
cd frontend
npm run test:e2e
```

---

## 📊 Database Migrations

### Create a New Migration
```bash
cd backend
npx sequelize-cli migration:generate --name your-migration-name
```

### Run Migrations
```bash
npm run db:migrate
```

### Rollback Migration
```bash
npm run db:migrate:undo
```

### Reset Database
```bash
npm run db:reset
```

---

## 🔒 Security

### HIPAA Compliance
- All patient data encrypted at rest (AES-256)
- TLS 1.3 for data in transit
- Access logs for all PHI access
- Business Associate Agreements with vendors
- Regular security audits

### Authentication
- JWT tokens with short expiry (15 minutes)
- Refresh tokens for session management
- OAuth2 integration (Google, Facebook)
- Two-factor authentication support
- Role-based access control (RBAC)

### Data Protection
- Password hashing with bcrypt (10 rounds)
- Encrypted session notes and messages
- Secure file uploads with validation
- Rate limiting on all endpoints
- CSRF protection

---

## 🚨 Crisis Detection

Terapitika implements a multi-layer crisis detection system:

1. **Keyword Detection**: Identifies high-risk phrases
2. **Sentiment Analysis**: Analyzes emotional tone
3. **ML Model**: Advanced pattern recognition
4. **Context Analysis**: Evaluates conversation history

### Response Levels
- **Low**: Flag for therapist review
- **Medium**: Immediate therapist notification
- **High**: Direct human intervention required
- **Critical**: Emergency protocol activation

---

## 📈 Monitoring

### Application Monitoring
- **Sentry**: Error tracking and performance monitoring
- **DataDog**: Infrastructure and application metrics
- **Winston**: Structured logging

### Health Checks
- Database connectivity
- Redis availability
- External API status
- WebSocket connections

Access health endpoint: `GET /api/health`

---

## 🐳 Docker Deployment

### Build Production Images
```bash
docker-compose -f docker-compose.prod.yml build
```

### Deploy to Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### View Logs
```bash
docker-compose logs -f [service-name]
```

---

## 📝 API Documentation

API documentation is available at `/api/docs` when running the development server.

OpenAPI/Swagger specification: `docs/api/openapi.yaml`

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Write tests for new features
- Update documentation as needed

---

## 📜 License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 👥 Team

- **Project Lead**: [Your Name]
- **Frontend Developer**: [Name]
- **Backend Developer**: [Name]
- **AI Engineer**: [Name]
- **DevOps Engineer**: [Name]

---

## 📞 Support

- **Email**: support@terapitika.com
- **Documentation**: https://docs.terapitika.com
- **Issue Tracker**: https://github.com/yourusername/terapitika/issues

---

## 🗺️ Roadmap

### Phase 1 (Weeks 1-4) ✅
- [x] Core infrastructure setup
- [x] Database schema implementation
- [x] Authentication system
- [x] Basic API endpoints

### Phase 2 (Weeks 5-8)
- [ ] AI chat integration
- [ ] User dashboard
- [ ] Therapist registration
- [ ] Booking system

### Phase 3 (Weeks 9-12)
- [ ] Video/voice sessions
- [ ] Payment integration
- [ ] Crisis detection system
- [ ] Admin panel

### Phase 4 (Weeks 13-16)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Insurance integration
- [ ] Multi-language support

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Anthropic Claude](https://www.anthropic.com/)
- [Twilio](https://www.twilio.com/)
- [Stripe](https://stripe.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

## ⚠️ Important Notes

### Before Going to Production
- [ ] Change all default passwords and secrets
- [ ] Enable HTTPS/TLS certificates
- [ ] Configure proper CORS origins
- [ ] Set up automated backups
- [ ] Configure monitoring and alerting
- [ ] Review and test crisis detection system
- [ ] Obtain necessary healthcare compliance certifications
- [ ] Set up disaster recovery plan
- [ ] Configure rate limiting for production traffic
- [ ] Enable database encryption
- [ ] Set up log aggregation
- [ ] Configure CDN for static assets
- [ ] Review and optimize database indexes
- [ ] Set up staging environment
- [ ] Conduct security audit
- [ ] Obtain professional liability insurance
- [ ] Verify all therapist licenses
- [ ] Set up on-call rotation for crisis support

---

<div align="center">
  <strong>Built with ❤️ for better mental health access</strong>
</div>
