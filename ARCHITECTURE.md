# Terapitika - Full Stack Architecture

## Project Overview
Terapitika is a hybrid mental health platform combining AI-powered therapy with licensed human therapists, offering text, voice, and video communication channels.

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ (React 18+)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand / Redux Toolkit
- **Real-time**: Socket.io-client
- **Video/Voice**: WebRTC (Simple-peer / PeerJS) + Twilio as fallback
- **Forms**: React Hook Form + Zod validation
- **API Client**: Axios / TanStack Query (React Query)

### Backend
- **Framework**: Node.js + Express.js / NestJS (recommended for scalability)
- **Language**: TypeScript
- **Database**: PostgreSQL 15+ (primary)
- **Cache**: Redis (sessions, rate limiting, real-time presence)
- **ORM**: Prisma / TypeORM
- **Real-time**: Socket.io
- **Authentication**: JWT + Refresh Tokens + OAuth2
- **File Storage**: AWS S3 / CloudFlare R2 (HIPAA compliant)
- **Video Infrastructure**: Twilio Video / Agora.io (HIPAA BAA available)

### AI & ML
- **Primary LLM**: Anthropic Claude API (with healthcare prompt engineering)
- **Speech-to-Text**: Google Cloud Speech-to-Text API
- **Text-to-Speech**: Google Cloud Text-to-Speech / ElevenLabs
- **Sentiment Analysis**: Custom model or Azure Cognitive Services
- **Crisis Detection**: Rule-based + ML hybrid system

### DevOps & Infrastructure
- **Hosting**: AWS / Google Cloud (HIPAA compliant tiers)
- **Container Orchestration**: Docker + Kubernetes / AWS ECS
- **CI/CD**: GitHub Actions / GitLab CI
- **Monitoring**: DataDog / New Relic / Sentry
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **CDN**: CloudFlare (with healthcare compliance)

### Security & Compliance
- **Encryption**: AES-256 at rest, TLS 1.3 in transit
- **Secrets Management**: AWS Secrets Manager / HashiCorp Vault
- **HIPAA Compliance**: AWS BAA, encrypted backups, audit logs
- **WAF**: CloudFlare WAF / AWS WAF
- **DDoS Protection**: CloudFlare / AWS Shield

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  Web App (Next.js)          │      Mobile (Future)          │
│  - Landing Page             │      - React Native           │
│  - Dashboard                │      - Flutter                │
│  - Chat Interface           │                               │
│  - Video/Voice UI           │                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                       │
├─────────────────────────────────────────────────────────────┤
│  - Load Balancer (AWS ALB / NGINX)                          │
│  - Rate Limiting (Redis)                                     │
│  - Request Validation                                        │
│  - Authentication Middleware                                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Auth       │  │   User       │  │  Therapist   │     │
│  │   Service    │  │   Service    │  │  Service     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Chat       │  │   AI         │  │  Booking     │     │
│  │   Service    │  │   Service    │  │  Service     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Video/     │  │   Payment    │  │  Support     │     │
│  │   Voice      │  │   Service    │  │  Service     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │    Redis     │  │   AWS S3     │     │
│  │  (Primary)   │  │   (Cache)    │  │  (Files)     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
├─────────────────────────────────────────────────────────────┤
│  - Anthropic Claude API (AI Therapy)                        │
│  - Twilio (Video/Voice/SMS)                                 │
│  - Stripe (Payments)                                         │
│  - Calendly API (Scheduling)                                │
│  - SendGrid/AWS SES (Email)                                 │
│  - Google Cloud Speech APIs                                 │
│  - 988 Crisis Integration                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- NULL for OAuth users
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(20),
  profile_picture_url TEXT,
  role VARCHAR(20) NOT NULL DEFAULT 'client', -- 'client', 'therapist', 'admin', 'guest'
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  auth_provider VARCHAR(50) DEFAULT 'local', -- 'local', 'google', 'facebook'
  oauth_id VARCHAR(255),
  emergency_contact JSONB, -- {name, phone, relationship}
  preferences JSONB, -- {language, timezone, notification_settings}
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  deleted_at TIMESTAMP -- Soft delete
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_oauth ON users(auth_provider, oauth_id);
```

### Guest Sessions Table
```sql
CREATE TABLE guest_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token VARCHAR(255) UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  message_count INTEGER DEFAULT 0,
  max_messages INTEGER DEFAULT 10,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_guest_sessions_token ON guest_sessions(session_token);
CREATE INDEX idx_guest_sessions_expires ON guest_sessions(expires_at);
```

### Therapists Table
```sql
CREATE TABLE therapists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  license_number VARCHAR(100) NOT NULL,
  license_state VARCHAR(50) NOT NULL,
  license_expiry DATE NOT NULL,
  license_verification_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  specializations TEXT[], -- ARRAY['anxiety', 'depression', 'trauma', 'couples']
  bio TEXT,
  years_of_experience INTEGER,
  education JSONB, -- [{degree, institution, year}]
  certifications JSONB, -- [{name, issuer, year}]
  languages TEXT[],
  hourly_rate DECIMAL(10,2),
  accepts_insurance BOOLEAN DEFAULT FALSE,
  insurance_providers TEXT[],
  availability_schedule JSONB, -- {monday: [{start: '09:00', end: '17:00'}], ...}
  video_enabled BOOLEAN DEFAULT TRUE,
  voice_enabled BOOLEAN DEFAULT TRUE,
  chat_enabled BOOLEAN DEFAULT TRUE,
  rating_average DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  is_accepting_clients BOOLEAN DEFAULT TRUE,
  verification_documents JSONB, -- URLs to uploaded license docs
  stripe_account_id VARCHAR(255), -- For therapist payouts
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_therapists_user_id ON therapists(user_id);
CREATE INDEX idx_therapists_specializations ON therapists USING GIN(specializations);
CREATE INDEX idx_therapists_verification ON therapists(license_verification_status);
```

### Sessions (Therapy Sessions) Table
```sql
CREATE TABLE therapy_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  therapist_id UUID REFERENCES therapists(id) ON DELETE SET NULL,
  session_type VARCHAR(20) NOT NULL, -- 'ai_only', 'human_therapist'
  communication_mode VARCHAR(20), -- 'chat', 'voice', 'video'
  scheduled_at TIMESTAMP,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  duration_minutes INTEGER,
  status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'
  session_notes TEXT, -- Therapist notes (encrypted)
  ai_summary TEXT, -- AI-generated summary
  crisis_flags JSONB, -- [{timestamp, severity, content}]
  recording_url TEXT, -- If recorded (with consent)
  transcript_url TEXT,
  payment_status VARCHAR(20), -- 'pending', 'paid', 'refunded'
  payment_amount DECIMAL(10,2),
  cancellation_reason TEXT,
  cancelled_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_therapy_sessions_client ON therapy_sessions(client_id);
CREATE INDEX idx_therapy_sessions_therapist ON therapy_sessions(therapist_id);
CREATE INDEX idx_therapy_sessions_scheduled ON therapy_sessions(scheduled_at);
CREATE INDEX idx_therapy_sessions_status ON therapy_sessions(status);
```

### Messages Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES therapy_sessions(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  sender_type VARCHAR(20) NOT NULL, -- 'client', 'therapist', 'ai', 'guest'
  content TEXT NOT NULL, -- Encrypted
  content_type VARCHAR(20) DEFAULT 'text', -- 'text', 'image', 'audio', 'file'
  file_url TEXT,
  sentiment_score DECIMAL(3,2), -- -1 to 1
  crisis_detected BOOLEAN DEFAULT FALSE,
  crisis_severity VARCHAR(20), -- 'low', 'medium', 'high', 'critical'
  ai_flagged BOOLEAN DEFAULT FALSE,
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_session ON messages(session_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_crisis ON messages(crisis_detected);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  therapist_id UUID REFERENCES therapists(id) ON DELETE CASCADE,
  session_id UUID UNIQUE REFERENCES therapy_sessions(id),
  scheduled_at TIMESTAMP NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  booking_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
  communication_mode VARCHAR(20), -- 'chat', 'voice', 'video'
  notes TEXT, -- Client notes/reason for booking
  reminder_sent BOOLEAN DEFAULT FALSE,
  calendly_event_id VARCHAR(255), -- If using Calendly
  zoom_meeting_id VARCHAR(255), -- If using Zoom
  twilio_room_sid VARCHAR(255), -- If using Twilio
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_therapist ON bookings(therapist_id);
CREATE INDEX idx_bookings_scheduled ON bookings(scheduled_at);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
```

### Reviews Table
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  therapist_id UUID REFERENCES therapists(id) ON DELETE CASCADE,
  session_id UUID REFERENCES therapy_sessions(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  therapist_response TEXT,
  responded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_therapist ON reviews(therapist_id);
CREATE INDEX idx_reviews_client ON reviews(client_id);
```

### Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  therapist_id UUID REFERENCES therapists(id),
  session_id UUID REFERENCES therapy_sessions(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50), -- 'stripe', 'insurance'
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'succeeded', 'failed', 'refunded'
  failure_reason TEXT,
  refund_amount DECIMAL(10,2),
  refunded_at TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_therapist ON payments(therapist_id);
CREATE INDEX idx_payments_session ON payments(session_id);
CREATE INDEX idx_payments_status ON payments(status);
```

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  plan_type VARCHAR(50) NOT NULL, -- 'free', 'basic', 'premium', 'unlimited'
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'cancelled', 'past_due', 'unpaid'
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMP,
  ai_message_limit INTEGER, -- NULL for unlimited
  ai_messages_used INTEGER DEFAULT 0,
  monthly_therapist_hours INTEGER, -- Included hours
  monthly_therapist_hours_used DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

### Crisis Logs Table
```sql
CREATE TABLE crisis_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES therapy_sessions(id),
  message_id UUID REFERENCES messages(id),
  severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
  crisis_type VARCHAR(50), -- 'suicide', 'self_harm', 'violence', 'psychosis'
  detected_by VARCHAR(20), -- 'ai', 'therapist', 'manual_report'
  content_snippet TEXT, -- Encrypted snippet that triggered flag
  action_taken TEXT,
  escalated_to VARCHAR(20), -- 'on_call_therapist', '988', 'emergency_services'
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP,
  resolved_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_crisis_logs_user ON crisis_logs(user_id);
CREATE INDEX idx_crisis_logs_severity ON crisis_logs(severity);
CREATE INDEX idx_crisis_logs_resolved ON crisis_logs(resolved);
CREATE INDEX idx_crisis_logs_created ON crisis_logs(created_at DESC);
```

### Support Tickets Table
```sql
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50), -- 'technical', 'billing', 'clinical', 'general'
  priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  status VARCHAR(20) DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
  assigned_to UUID REFERENCES users(id),
  resolution_notes TEXT,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_assigned ON support_tickets(assigned_to);
```

### Support Messages Table
```sql
CREATE TABLE support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  attachments JSONB, -- [{filename, url, size}]
  is_internal BOOLEAN DEFAULT FALSE, -- Internal staff notes
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_support_messages_ticket ON support_messages(ticket_id);
```

### Notifications Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'booking_confirmed', 'session_reminder', 'message_received', etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  sent_via JSONB, -- {email: true, push: true, sms: false}
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

### Audit Logs Table (HIPAA Compliance)
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL, -- 'login', 'view_record', 'update_profile', etc.
  resource_type VARCHAR(50), -- 'user', 'session', 'message', etc.
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  changes JSONB, -- Before/after values
  status VARCHAR(20), -- 'success', 'failure'
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
```

### AI Conversations Table (for analytics)
```sql
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  guest_session_id UUID REFERENCES guest_sessions(id),
  session_id UUID REFERENCES therapy_sessions(id),
  message_count INTEGER DEFAULT 0,
  avg_sentiment DECIMAL(3,2),
  topics JSONB, -- Extracted topics/themes
  crisis_count INTEGER DEFAULT 0,
  duration_minutes INTEGER,
  outcome VARCHAR(50), -- 'completed', 'escalated_to_human', 'abandoned'
  user_satisfaction INTEGER CHECK (user_satisfaction >= 1 AND user_satisfaction <= 5),
  created_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP
);

CREATE INDEX idx_ai_conversations_user ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_guest ON ai_conversations(guest_session_id);
```

---

## API Endpoints Structure

### Authentication Endpoints
```
POST   /api/auth/register                 - User registration
POST   /api/auth/login                    - User login
POST   /api/auth/logout                   - User logout
POST   /api/auth/refresh                  - Refresh access token
POST   /api/auth/forgot-password          - Request password reset
POST   /api/auth/reset-password           - Reset password with token
POST   /api/auth/verify-email             - Verify email address
GET    /api/auth/oauth/:provider          - OAuth login (Google, Facebook)
GET    /api/auth/oauth/:provider/callback - OAuth callback
POST   /api/auth/guest/create             - Create guest session
```

### User Endpoints
```
GET    /api/users/me                      - Get current user
PATCH  /api/users/me                      - Update current user
DELETE /api/users/me                      - Delete account
GET    /api/users/me/profile              - Get detailed profile
PATCH  /api/users/me/profile-picture     - Upload profile picture
GET    /api/users/me/sessions             - Get user's therapy sessions
GET    /api/users/me/bookings             - Get user's bookings
GET    /api/users/me/subscription         - Get subscription details
```

### Therapist Endpoints
```
GET    /api/therapists                    - List all therapists (with filters)
GET    /api/therapists/:id                - Get therapist details
GET    /api/therapists/:id/availability   - Get therapist availability
POST   /api/therapists/register           - Therapist registration
PATCH  /api/therapists/me                 - Update therapist profile
POST   /api/therapists/me/verify          - Submit verification documents
GET    /api/therapists/me/clients         - Get therapist's clients
GET    /api/therapists/me/sessions        - Get therapist's sessions
GET    /api/therapists/me/earnings        - Get earnings report
PATCH  /api/therapists/me/availability    - Update availability schedule
```

### Session Endpoints
```
POST   /api/sessions/ai                   - Start AI chat session
POST   /api/sessions/therapist            - Start therapist session
GET    /api/sessions/:id                  - Get session details
PATCH  /api/sessions/:id                  - Update session
DELETE /api/sessions/:id                  - End/cancel session
GET    /api/sessions/:id/messages         - Get session messages
POST   /api/sessions/:id/messages         - Send message
GET    /api/sessions/:id/transcript       - Get session transcript
POST   /api/sessions/:id/notes            - Add therapist notes
GET    /api/sessions/:id/summary          - Get AI summary
```

### Booking Endpoints
```
POST   /api/bookings                      - Create booking
GET    /api/bookings/:id                  - Get booking details
PATCH  /api/bookings/:id                  - Update booking
DELETE /api/bookings/:id                  - Cancel booking
GET    /api/bookings/available-slots      - Get available time slots
POST   /api/bookings/:id/confirm          - Confirm booking
POST   /api/bookings/:id/reschedule       - Reschedule booking
```

### Chat/Messaging Endpoints (REST + WebSocket)
```
WebSocket: /api/ws/chat/:sessionId       - Real-time chat

POST   /api/chat/send                     - Send message (REST fallback)
GET    /api/chat/:sessionId/history       - Get chat history
POST   /api/chat/:sessionId/typing        - Typing indicator
PATCH  /api/chat/messages/:id             - Edit message
DELETE /api/chat/messages/:id             - Delete message
POST   /api/chat/upload                   - Upload file/image
```

### Video/Voice Endpoints
```
POST   /api/video/room/create             - Create video room
GET    /api/video/room/:id/token          - Get video access token
POST   /api/video/room/:id/join           - Join video room
DELETE /api/video/room/:id                - End video session
GET    /api/video/room/:id/participants   - Get current participants
POST   /api/voice/call/initiate           - Initiate voice call
POST   /api/voice/call/:id/answer         - Answer voice call
DELETE /api/voice/call/:id                - End voice call
```

### AI Endpoints
```
POST   /api/ai/chat                       - AI chat completion
POST   /api/ai/voice/transcribe           - Transcribe audio to text
POST   /api/ai/voice/synthesize           - Text to speech
POST   /api/ai/analyze-sentiment          - Analyze message sentiment
POST   /api/ai/detect-crisis              - Crisis detection analysis
GET    /api/ai/suggestions                - Get conversation suggestions
```

### Payment Endpoints
```
POST   /api/payments/intent               - Create payment intent
POST   /api/payments/confirm              - Confirm payment
GET    /api/payments/history              - Get payment history
POST   /api/payments/refund               - Process refund
GET    /api/payments/invoice/:id          - Get invoice
```

### Subscription Endpoints
```
GET    /api/subscriptions/plans           - Get available plans
POST   /api/subscriptions/subscribe       - Create subscription
PATCH  /api/subscriptions/upgrade         - Upgrade subscription
DELETE /api/subscriptions/cancel          - Cancel subscription
POST   /api/subscriptions/reactivate      - Reactivate subscription
GET    /api/subscriptions/usage           - Get usage statistics
```

### Review Endpoints
```
POST   /api/reviews                       - Create review
GET    /api/reviews/therapist/:id         - Get therapist reviews
PATCH  /api/reviews/:id                   - Update review
DELETE /api/reviews/:id                   - Delete review
POST   /api/reviews/:id/respond           - Therapist response
```

### Support Endpoints
```
POST   /api/support/tickets               - Create support ticket
GET    /api/support/tickets               - List tickets
GET    /api/support/tickets/:id           - Get ticket details
PATCH  /api/support/tickets/:id           - Update ticket
POST   /api/support/tickets/:id/messages  - Add message to ticket
POST   /api/support/tickets/:id/close     - Close ticket
```

### Notification Endpoints
```
GET    /api/notifications                 - Get all notifications
GET    /api/notifications/unread          - Get unread notifications
PATCH  /api/notifications/:id/read        - Mark as read
PATCH  /api/notifications/read-all        - Mark all as read
DELETE /api/notifications/:id             - Delete notification
```

### Admin Endpoints
```
GET    /api/admin/users                   - List all users
GET    /api/admin/users/:id               - Get user details
PATCH  /api/admin/users/:id               - Update user
DELETE /api/admin/users/:id               - Delete user
GET    /api/admin/therapists/pending      - Pending verifications
PATCH  /api/admin/therapists/:id/verify   - Verify therapist
GET    /api/admin/analytics               - Platform analytics
GET    /api/admin/crisis-logs             - Crisis log dashboard
POST   /api/admin/broadcast               - Send broadcast notification
```

### Calendly Integration Endpoints
```
POST   /api/integrations/calendly/connect - Connect Calendly account
GET    /api/integrations/calendly/events  - Get Calendly events
POST   /api/integrations/calendly/sync    - Sync availability
DELETE /api/integrations/calendly/disconnect - Disconnect account
```

---

## Real-Time Communication Flow

### WebSocket Events

#### Client → Server
```javascript
// Chat events
'chat:join' - Join a chat session
'chat:leave' - Leave a chat session
'chat:message' - Send a message
'chat:typing' - Typing indicator
'chat:read' - Mark messages as read

// Video/Voice events
'video:join' - Join video call
'video:leave' - Leave video call
'video:offer' - WebRTC offer
'video:answer' - WebRTC answer
'video:ice-candidate' - ICE candidate

// Presence events
'presence:online' - User online
'presence:offline' - User offline
'presence:away' - User away
```

#### Server → Client
```javascript
// Chat events
'chat:message' - New message received
'chat:typing' - User typing
'chat:user-joined' - User joined session
'chat:user-left' - User left session
'chat:ai-response' - AI response ready

// Video/Voice events
'video:user-joined' - User joined video
'video:user-left' - User left video
'video:offer' - Receive WebRTC offer
'video:answer' - Receive WebRTC answer
'video:ice-candidate' - Receive ICE candidate

// Notification events
'notification:new' - New notification
'notification:booking-confirmed' - Booking confirmed
'notification:session-starting' - Session starting soon
'notification:crisis-alert' - Crisis detected

// System events
'system:maintenance' - Maintenance mode
'system:error' - System error
```

---

## Security Implementation

### Authentication Flow
```
1. User submits credentials
2. Backend validates credentials
3. Generate JWT access token (15 min expiry)
4. Generate refresh token (7 days expiry)
5. Store refresh token in HTTP-only cookie
6. Return access token in response
7. Client stores access token in memory
8. Client includes access token in Authorization header
9. On token expiry, use refresh token to get new access token
```

### Role-Based Access Control (RBAC)
```typescript
enum Role {
  GUEST = 'guest',
  CLIENT = 'client',
  THERAPIST = 'therapist',
  ADMIN = 'admin',
}

enum Permission {
  // User permissions
  VIEW_OWN_PROFILE = 'view:own:profile',
  UPDATE_OWN_PROFILE = 'update:own:profile',
  DELETE_OWN_ACCOUNT = 'delete:own:account',
  
  // Session permissions
  CREATE_AI_SESSION = 'create:ai:session',
  CREATE_THERAPIST_SESSION = 'create:therapist:session',
  VIEW_OWN_SESSIONS = 'view:own:sessions',
  
  // Therapist permissions
  VIEW_CLIENT_SESSIONS = 'view:client:sessions',
  UPDATE_SESSION_NOTES = 'update:session:notes',
  MANAGE_AVAILABILITY = 'manage:availability',
  VIEW_EARNINGS = 'view:earnings',
  
  // Admin permissions
  VIEW_ALL_USERS = 'view:all:users',
  VERIFY_THERAPISTS = 'verify:therapists',
  VIEW_ANALYTICS = 'view:analytics',
  MANAGE_PLATFORM = 'manage:platform',
}

const rolePermissions = {
  [Role.GUEST]: [
    Permission.CREATE_AI_SESSION, // Limited
  ],
  [Role.CLIENT]: [
    Permission.VIEW_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,
    Permission.DELETE_OWN_ACCOUNT,
    Permission.CREATE_AI_SESSION,
    Permission.CREATE_THERAPIST_SESSION,
    Permission.VIEW_OWN_SESSIONS,
  ],
  [Role.THERAPIST]: [
    // All client permissions plus:
    Permission.VIEW_CLIENT_SESSIONS,
    Permission.UPDATE_SESSION_NOTES,
    Permission.MANAGE_AVAILABILITY,
    Permission.VIEW_EARNINGS,
  ],
  [Role.ADMIN]: [
    // All permissions
    Permission.VIEW_ALL_USERS,
    Permission.VERIFY_THERAPISTS,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_PLATFORM,
  ],
};
```

### Data Encryption
```
- All sensitive data encrypted at rest (AES-256)
- TLS 1.3 for data in transit
- Session notes and messages encrypted in database
- Encryption keys rotated every 90 days
- Patient data encrypted with user-specific keys
```

### Rate Limiting Strategy
```
Guest users:
- 10 messages per session
- 3 sessions per IP per day
- No video/voice access

Authenticated users (Free):
- 50 AI messages per day
- 1 therapist session per month
- Standard API rate limits (100 req/min)

Premium users:
- Unlimited AI messages
- Unlimited therapist sessions (based on plan)
- Higher API rate limits (1000 req/min)

Therapists:
- Unlimited sessions
- Higher API rate limits (500 req/min)
```

---

## Crisis Detection System

### Multi-Layer Detection
```typescript
interface CrisisDetectionConfig {
  // Layer 1: Keyword detection
  criticalKeywords: string[];
  // Layer 2: Sentiment analysis
  sentimentThreshold: number;
  // Layer 3: ML model
  mlModelEndpoint: string;
  // Layer 4: Context analysis
  conversationWindowSize: number;
}

const crisisKeywords = {
  suicide: ['kill myself', 'end my life', 'suicide', 'want to die'],
  selfHarm: ['cut myself', 'hurt myself', 'self-harm'],
  violence: ['hurt someone', 'kill them', 'violent thoughts'],
  psychosis: ['voices telling me', 'hallucinating', 'not real'],
};

async function detectCrisis(message: string, conversationHistory: Message[]): Promise<CrisisAnalysis> {
  // Layer 1: Keyword matching
  const keywordMatch = checkCrisisKeywords(message);
  
  // Layer 2: Sentiment analysis
  const sentiment = await analyzeSentiment(message);
  
  // Layer 3: ML model
  const mlScore = await callCrisisDetectionModel(message, conversationHistory);
  
  // Layer 4: Contextual analysis
  const context = analyzeConversationContext(conversationHistory);
  
  // Aggregate scores
  const severity = calculateCrisisSeverity({
    keywordMatch,
    sentiment,
    mlScore,
    context,
  });
  
  return {
    isCrisis: severity >= CRISIS_THRESHOLD,
    severity,
    type: identifyCrisisType(keywordMatch),
    recommendedAction: getRecommendedAction(severity),
  };
}
```

### Crisis Response Protocol
```
Severity: LOW (0-25)
- Flag conversation for therapist review
- Provide supportive AI responses
- Offer resources (988, crisis lines)

Severity: MEDIUM (26-50)
- Notify on-call therapist immediately
- Suggest switching to human therapist
- Provide crisis resources prominently

Severity: HIGH (51-75)
- Immediate therapist intervention required
- Disable AI responses, route to human
- Send emergency notifications
- Display 988 Suicide & Crisis Lifeline

Severity: CRITICAL (76-100)
- Emergency protocol activation
- Attempt to get user location (with consent)
- Contact emergency services if imminent danger
- Notify multiple on-call therapists
- Document everything for legal protection
```

---

## File Storage Structure

### S3 Bucket Organization
```
terapitika-production/
├── users/
│   ├── {user_id}/
│   │   ├── profile-pictures/
│   │   │   └── {timestamp}-{filename}
│   │   ├── documents/
│   │   │   └── {document_id}-{filename}
│   │   └── voice-recordings/
│   │       └── {session_id}-{timestamp}.mp3
├── therapists/
│   ├── {therapist_id}/
│   │   ├── license-documents/
│   │   │   └── {document_id}-{filename}
│   │   ├── certifications/
│   │   │   └── {cert_id}-{filename}
│   │   └── profile-pictures/
│   │       └── {timestamp}-{filename}
├── sessions/
│   ├── {session_id}/
│   │   ├── recordings/
│   │   │   ├── video-{timestamp}.mp4
│   │   │   └── audio-{timestamp}.mp3
│   │   ├── transcripts/
│   │   │   └── transcript-{timestamp}.txt
│   │   └── attachments/
│   │       └── {message_id}-{filename}
└── support/
    └── {ticket_id}/
        └── {attachment_id}-{filename}
```

---

## Environment Variables

### Backend (.env)
```bash
# Application
NODE_ENV=production
PORT=5000
APP_URL=https://terapitika.com
API_URL=https://api.terapitika.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/terapitika
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# AI Services
ANTHROPIC_API_KEY=your-claude-api-key
OPENAI_API_KEY=your-openai-key (backup)

# Speech Services
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_CREDENTIALS_PATH=/path/to/credentials.json
ELEVENLABS_API_KEY=your-elevenlabs-key

# Video/Voice
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_API_KEY=your-twilio-api-key
TWILIO_API_SECRET=your-twilio-api-secret

# Payments
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
STRIPE_PUBLISHABLE_KEY=your-publishable-key

# Email
SENDGRID_API_KEY=your-sendgrid-key
FROM_EMAIL=noreply@terapitika.com

# SMS
TWILIO_PHONE_NUMBER=+1234567890

# Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=terapitika-production
AWS_REGION=us-east-1

# Calendly
CALENDLY_CLIENT_ID=your-calendly-client-id
CALENDLY_CLIENT_SECRET=your-calendly-client-secret

# Monitoring
SENTRY_DSN=your-sentry-dsn
DATADOG_API_KEY=your-datadog-key

# Crisis Services
CRISIS_HOTLINE_API_KEY=your-988-integration-key

# Security
ENCRYPTION_KEY=your-32-byte-encryption-key
COOKIE_SECRET=your-cookie-secret
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://api.terapitika.com
NEXT_PUBLIC_WS_URL=wss://api.terapitika.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-key
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_APP_ENV=production
```

---

## Deployment Strategy

### Development
```
- Local Docker Compose setup
- PostgreSQL + Redis containers
- Hot reload enabled
- Debug mode
- Local S3 (MinIO)
```

### Staging
```
- AWS ECS/Kubernetes
- RDS PostgreSQL (Multi-AZ)
- ElastiCache Redis
- S3 for storage
- CloudFront CDN
- Same config as production
- Automated E2E tests
```

### Production
```
- Multi-region deployment (primary: us-east-1)
- Auto-scaling groups
- RDS PostgreSQL (Multi-AZ, read replicas)
- ElastiCache Redis (cluster mode)
- S3 with versioning + lifecycle policies
- CloudFront CDN
- WAF + DDoS protection
- Automated backups every 6 hours
- Blue-green deployment
```

### CI/CD Pipeline
```
1. Code push to GitHub
2. Run linting and tests
3. Build Docker images
4. Push to ECR
5. Run security scans
6. Deploy to staging
7. Run E2E tests
8. Manual approval
9. Deploy to production (blue-green)
10. Monitor metrics
11. Automatic rollback on errors
```

---

## Monitoring & Logging

### Metrics to Track
```
Application:
- API response times (p50, p95, p99)
- Error rates by endpoint
- Active users/sessions
- WebSocket connections
- Database query performance

Business:
- New user registrations
- Session bookings
- Revenue per day/week/month
- Therapist utilization rates
- AI vs human session ratio
- Crisis detection frequency
- User satisfaction scores

Infrastructure:
- CPU/Memory usage
- Database connections
- Redis cache hit rate
- S3 storage usage
- CDN bandwidth
- SSL certificate expiry
```

### Alerting Rules
```
Critical:
- API error rate > 5%
- Database connection pool exhausted
- Crisis detection system down
- Payment processing failures
- SSL certificate expiring in < 7 days

Warning:
- API response time p95 > 2s
- Database CPU > 80%
- Redis memory > 80%
- Unusual spike in failed logins
- Low therapist availability

Info:
- New user registration
- Successful payment
- Therapist verification pending
```

---

## Testing Strategy

### Unit Tests
- All service functions
- Utility functions
- Validation schemas
- 80%+ code coverage

### Integration Tests
- API endpoints
- Database operations
- External service integrations
- WebSocket events

### E2E Tests
- User registration flow
- Booking flow
- Chat session
- Video call
- Payment processing
- Admin operations

### Security Tests
- Penetration testing
- Vulnerability scanning
- OWASP Top 10 checks
- Data encryption verification

### Load Tests
- 1000 concurrent users
- 10,000 messages/minute
- 500 simultaneous video calls
- Database performance under load

---

## Compliance Checklist

### HIPAA Compliance
- [ ] Business Associate Agreements (BAAs) with all vendors
- [ ] Encrypted data at rest and in transit
- [ ] Access controls and authentication
- [ ] Audit logging of all PHI access
- [ ] Regular security risk assessments
- [ ] Incident response plan
- [ ] Employee training on HIPAA
- [ ] Data backup and disaster recovery
- [ ] Breach notification procedures

### GDPR Compliance (if serving EU)
- [ ] Privacy policy and terms of service
- [ ] Cookie consent
- [ ] Data portability (export user data)
- [ ] Right to be forgotten (account deletion)
- [ ] Data processing agreements
- [ ] Privacy impact assessment

### State Licensing (Telehealth)
- [ ] Verify therapist licenses for each state
- [ ] Comply with state-specific telehealth laws
- [ ] Informed consent for telehealth
- [ ] Emergency protocols by state
- [ ] Record keeping requirements

---

This architecture provides a solid foundation for Terapitika. Next steps would be:
1. Set up the development environment
2. Initialize the database schema
3. Build core API endpoints
4. Implement authentication
5. Create the frontend pages

Would you like me to proceed with creating the actual code structure and initial implementation?
