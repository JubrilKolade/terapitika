# Terapitika - Web Application Pages & Components

## Page Structure Overview

```
/
├── Landing Page (Public)
├── /about
├── /how-it-works
├── /therapists (Public Therapist Directory)
├── /pricing
├── /resources
├── /blog
├── /legal
│   ├── /privacy-policy
│   ├── /terms-of-service
│   └── /hipaa-notice
│
├── /auth
│   ├── /login
│   ├── /register
│   ├── /forgot-password
│   ├── /reset-password
│   └── /verify-email
│
├── /guest-chat (Guest AI Chat - No Auth Required)
│
├── /dashboard (Client Dashboard - Auth Required)
│   ├── /profile
│   ├── /settings
│   ├── /subscription
│   ├── /sessions
│   ├── /bookings
│   └── /notifications
│
├── /chat
│   ├── /ai (AI Chat Interface)
│   └── /[sessionId] (Active Chat Session)
│
├── /therapists
│   ├── /browse (Browse Therapists)
│   ├── /[therapistId] (Therapist Profile)
│   └── /book/[therapistId] (Booking Flow)
│
├── /session
│   ├── /video/[sessionId] (Video Session Interface)
│   ├── /voice/[sessionId] (Voice Session Interface)
│   └── /history (Session History)
│
├── /support
│   ├── /tickets (Support Tickets)
│   ├── /tickets/new (Create Ticket)
│   ├── /tickets/[ticketId] (Ticket Details)
│   └── /faq
│
├── /therapist-portal (Therapist Dashboard)
│   ├── /register (Therapist Registration)
│   ├── /dashboard
│   ├── /clients
│   ├── /schedule
│   ├── /sessions
│   ├── /earnings
│   ├── /profile
│   └── /settings
│
└── /admin (Admin Panel)
    ├── /dashboard
    ├── /users
    ├── /therapists
    ├── /sessions
    ├── /payments
    ├── /crisis-logs
    ├── /analytics
    └── /settings
```

---

## Detailed Page Specifications

### 1. Landing Page (/)

**Purpose**: Convert visitors into users, explain platform value

**Sections**:
1. **Hero Section**
   - Headline: "Professional Therapy, Powered by AI, Available 24/7"
   - Subheadline: "Connect with licensed therapists or get instant support from our AI companion"
   - CTA: "Start Free Chat" (Guest) + "Find a Therapist" (Auth)
   - Hero image/video

2. **How It Works**
   - Step 1: Choose your path (AI or Human therapist)
   - Step 2: Start chatting instantly or book a session
   - Step 3: Get support through text, voice, or video

3. **Key Features**
   - 24/7 AI Support
   - Licensed Therapists
   - Video, Voice & Chat
   - HIPAA Compliant
   - Affordable Pricing
   - Crisis Support

4. **Therapist Showcase**
   - Featured therapists carousel
   - Specializations, ratings, availability
   - "Browse All Therapists" CTA

5. **Testimonials**
   - User reviews and success stories
   - Before/after impact metrics

6. **Pricing Tiers**
   - Free (Guest + Limited AI)
   - Basic ($X/month)
   - Premium ($X/month)
   - Compare features

7. **Trust Indicators**
   - HIPAA compliant badge
   - SSL secure
   - Licensed therapists
   - Crisis support available
   - Media mentions

8. **Call to Action**
   - "Start Your Journey Today"
   - Sign up form or CTA buttons

**Components Needed**:
- `<HeroSection />`
- `<HowItWorks />`
- `<FeatureGrid />`
- `<TherapistCarousel />`
- `<TestimonialSection />`
- `<PricingTable />`
- `<TrustBadges />`
- `<Footer />`

---

### 2. Guest Chat Page (/guest-chat)

**Purpose**: Allow visitors to try AI chat without registration

**Features**:
- No authentication required
- Limited to 10 messages
- Text chat only (no voice/video)
- Crisis detection active
- Prominent "Sign up for unlimited" banner
- Progress indicator showing remaining messages
- Smooth transition to registration

**Components**:
- `<GuestChatInterface />`
- `<MessageList />`
- `<MessageInput />`
- `<MessageLimitBanner />`
- `<CrisisResourcesPanel />` (if triggered)
- `<UpgradePrompt />`

**State Management**:
```typescript
interface GuestChatState {
  sessionToken: string;
  messages: Message[];
  messageCount: number;
  maxMessages: number;
  isLimitReached: boolean;
  showUpgradePrompt: boolean;
}
```

---

### 3. Authentication Pages (/auth/*)

#### Login Page (/auth/login)
- Email/Password form
- OAuth buttons (Google, Facebook)
- "Remember me" checkbox
- "Forgot password?" link
- Link to registration
- Guest chat option

#### Register Page (/auth/register)
- Multi-step form:
  - Step 1: Basic info (name, email, password)
  - Step 2: Profile details (DOB, gender, phone)
  - Step 3: Emergency contact (optional)
  - Step 4: Preferences (timezone, language)
- OAuth registration
- Terms acceptance
- Email verification flow

#### Forgot Password (/auth/forgot-password)
- Email input
- Security question (optional)
- Email sent confirmation
- Resend link

#### Reset Password (/auth/reset-password)
- Token validation
- New password form
- Password strength indicator
- Success redirect to login

**Components**:
- `<LoginForm />`
- `<RegisterForm />`
- `<MultiStepForm />`
- `<OAuthButtons />`
- `<PasswordStrengthMeter />`
- `<FormValidation />`

---

### 4. Client Dashboard (/dashboard)

**Purpose**: Central hub for authenticated users

**Layout**:
```
┌─────────────────────────────────────────────────┐
│  Header (Logo, Search, Notifications, Profile)  │
├───────┬─────────────────────────────────────────┤
│       │  Main Content Area                      │
│       │                                         │
│ Side  │  ┌──────────────────────────────────┐ │
│ Nav   │  │  Quick Actions                    │ │
│       │  │  - Start AI Chat                  │ │
│ • Home│  │  - Book Therapist                 │ │
│ • Chat│  │  - View Schedule                  │ │
│ • Book│  └──────────────────────────────────┘ │
│ • Sess│                                         │
│ • Prof│  ┌──────────────────────────────────┐ │
│ • Sett│  │  Upcoming Sessions                │ │
│ • Help│  │  - Session 1 (Today, 2 PM)        │ │
│       │  │  - Session 2 (Tomorrow, 10 AM)    │ │
│       │  └──────────────────────────────────┘ │
│       │                                         │
│       │  ┌──────────────────────────────────┐ │
│       │  │  Recent Activity                  │ │
│       │  │  - Last AI chat (2 hours ago)     │ │
│       │  │  - Completed session with Dr. X   │ │
│       │  └──────────────────────────────────┘ │
│       │                                         │
│       │  ┌──────────────────────────────────┐ │
│       │  │  Wellness Tracking                │ │
│       │  │  - Mood chart                     │ │
│       │  │  - Session frequency              │ │
│       │  └──────────────────────────────────┘ │
└───────┴─────────────────────────────────────────┘
```

**Sections**:
1. Quick Actions (prominent CTAs)
2. Upcoming Sessions (calendar view)
3. Recent Activity (chat/session history)
4. Wellness Tracking (mood, progress)
5. Recommended Therapists
6. Resource Library access

**Components**:
- `<DashboardLayout />`
- `<SidebarNav />`
- `<QuickActionsCard />`
- `<UpcomingSessionsCard />`
- `<ActivityFeed />`
- `<WellnessChart />`
- `<TherapistRecommendations />`

---

### 5. Profile Page (/dashboard/profile)

**Tabs**:
1. **Personal Information**
   - Name, email, phone
   - Date of birth, gender
   - Profile picture upload
   - Address (optional)

2. **Emergency Contact**
   - Name, relationship, phone
   - Secondary contact

3. **Health Information** (Optional, encrypted)
   - Current concerns
   - Previous therapy experience
   - Medications
   - Medical conditions
   - Allergies

4. **Preferences**
   - Therapist preferences (gender, age, specialties)
   - Communication preferences (email, SMS, push)
   - Language, timezone
   - Accessibility needs

**Components**:
- `<ProfileTabs />`
- `<ProfileForm />`
- `<AvatarUpload />`
- `<EmergencyContactForm />`
- `<HealthInfoForm />` (encrypted)
- `<PreferencesForm />`

---

### 6. Settings Page (/dashboard/settings)

**Sections**:
1. **Account Settings**
   - Change password
   - Two-factor authentication
   - Email verification status
   - Phone verification

2. **Privacy & Security**
   - Session recording preferences
   - Data sharing settings
   - Who can view your profile
   - Download your data (GDPR)
   - Delete account

3. **Notifications**
   - Email notifications (on/off per type)
   - SMS notifications
   - Push notifications
   - Reminder settings
   - Marketing preferences

4. **Subscription & Billing**
   - Current plan
   - Usage statistics
   - Billing history
   - Payment methods
   - Upgrade/Downgrade

5. **Integrations**
   - Calendly connection
   - Google Calendar sync
   - Export data to health apps

**Components**:
- `<SettingsTabs />`
- `<AccountSettingsForm />`
- `<TwoFactorAuth />`
- `<PrivacySettings />`
- `<NotificationPreferences />`
- `<SubscriptionCard />`
- `<PaymentMethods />`
- `<IntegrationsList />`

---

### 7. Chat Interface (/chat/*)

#### AI Chat (/chat/ai)

**Layout**:
```
┌─────────────────────────────────────────────────┐
│  Chat Header                                     │
│  🤖 AI Therapist | Online | Crisis Hotline: 988  │
├─────────────────────────────────────────────────┤
│                                                  │
│  Message History (Scrollable)                   │
│                                                  │
│  ┌────────────────┐                             │
│  │  AI: Hello...  │                             │
│  └────────────────┘                             │
│                        ┌──────────────────────┐ │
│                        │  You: I'm feeling... │ │
│                        └──────────────────────┘ │
│  ┌────────────────┐                             │
│  │  AI: I'm here..│                             │
│  └────────────────┘                             │
│                                                  │
├─────────────────────────────────────────────────┤
│  [Type your message...]             [Send] [🎤] │
│  [📎] [😊]                                       │
└─────────────────────────────────────────────────┘

Sidebar (Optional, collapsible):
- Chat history
- Crisis resources
- Suggested topics
- Upgrade to human therapist
```

**Features**:
- Real-time message streaming
- Typing indicators
- Message timestamps
- Read receipts
- Crisis detection alerts
- Sentiment-aware responses
- Quick action buttons ("I need urgent help", "Schedule therapist")
- Voice input option
- Export transcript

**Components**:
- `<ChatLayout />`
- `<ChatHeader />`
- `<MessageList />`
- `<MessageBubble />`
- `<TypingIndicator />`
- `<MessageInput />`
- `<VoiceRecorder />`
- `<CrisisAlert />`
- `<ChatSidebar />`
- `<SuggestedTopics />`

#### Human Therapist Chat (/chat/[sessionId])

Similar to AI chat but with:
- Therapist avatar and name
- Session timer
- Session notes (visible to therapist)
- File sharing
- Drawing/whiteboard tool (for certain therapies)
- Switch to video/voice buttons

---

### 8. Therapists Pages (/therapists/*)

#### Browse Therapists (/therapists/browse)

**Filters** (Sidebar):
- Specialization (dropdown multi-select)
- Gender
- Language
- Availability (dates/times)
- Price range
- Insurance accepted
- Rating (4+ stars, etc.)
- Accepting new clients

**Sort Options**:
- Recommended (default)
- Rating (high to low)
- Price (low to high)
- Availability (soonest)
- Experience (years)

**Therapist Cards** (Grid/List view):
```
┌────────────────────────────────────────┐
│  [Photo]  Dr. Sarah Johnson           │
│           Licensed Therapist            │
│           ⭐⭐⭐⭐⭐ 4.9 (127 reviews)    │
│                                         │
│  Specialties: Anxiety, Depression, CBT │
│  Languages: English, Spanish            │
│  Experience: 8 years                    │
│  Rate: $120/hour                        │
│  Next Available: Tomorrow at 2 PM       │
│                                         │
│  [View Profile] [Book Session]         │
└────────────────────────────────────────┘
```

**Components**:
- `<TherapistFilters />`
- `<TherapistGrid />`
- `<TherapistCard />`
- `<SortDropdown />`
- `<ViewToggle />` (grid/list)
- `<Pagination />`

#### Therapist Profile (/therapists/[therapistId])

**Sections**:
1. **Header**
   - Profile photo
   - Name, credentials
   - Rating and reviews
   - Availability status
   - "Book Session" CTA

2. **About**
   - Bio
   - Approach to therapy
   - Specializations
   - Languages

3. **Credentials**
   - Education
   - Licenses
   - Certifications
   - Years of experience

4. **Specializations**
   - Detailed list with descriptions
   - Success stories per specialty

5. **Availability**
   - Calendar view
   - Available time slots
   - Timezone

6. **Pricing**
   - Hourly rate
   - Package deals
   - Insurance accepted
   - Payment methods

7. **Reviews**
   - Overall rating
   - Review filters (recent, highest, lowest)
   - Individual reviews with client feedback
   - Response from therapist

8. **FAQs**
   - Common questions answered by therapist

**Components**:
- `<TherapistProfileHeader />`
- `<AboutSection />`
- `<CredentialsCard />`
- `<SpecializationsList />`
- `<AvailabilityCalendar />`
- `<PricingCard />`
- `<ReviewsSection />`
- `<ReviewCard />`
- `<RatingDistribution />`
- `<BookingWidget />`

---

### 9. Booking & Scheduling Page (/therapists/book/[therapistId])

**Multi-Step Flow**:

**Step 1: Select Date & Time**
- Calendar view
- Available time slots
- Timezone indicator
- Duration selector (30min, 60min, 90min)

**Step 2: Session Details**
- Session type (video, voice, chat)
- Reason for visit (dropdown)
- Any specific concerns (textarea)
- First-time or follow-up

**Step 3: Confirm Details**
- Therapist info
- Date, time, duration
- Session type
- Price breakdown
- Cancellation policy

**Step 4: Payment**
- Payment method selection
- Insurance details (if applicable)
- Promo code
- Final price
- Terms acceptance

**Step 5: Confirmation**
- Booking confirmed message
- Add to calendar (Google, Apple, Outlook)
- Email confirmation sent
- SMS reminder opt-in
- Session details
- Therapist intro video (optional)

**Components**:
- `<BookingWizard />`
- `<DateTimePicker />`
- `<SessionTypeSelector />`
- `<BookingDetailsForm />`
- `<PaymentForm />`
- `<BookingConfirmation />`
- `<AddToCalendarButtons />`
- `<CancellationPolicy />`

---

### 10. Session Pages (/session/*)

#### Video Session (/session/video/[sessionId])

**Layout**:
```
┌────────────────────────────────────────────────┐
│  Session Timer: 00:15:32 | End Session | ☰    │
├────────────────────────────────────────────────┤
│                                                 │
│           [Therapist Video Feed]               │
│                                                 │
│                                                 │
│                                                 │
│           ┌──────────────────┐                 │
│           │  Your Video (PiP) │                 │
│           └──────────────────┘                 │
│                                                 │
├────────────────────────────────────────────────┤
│  [🎤 Mute] [📹 Video Off] [💬 Chat] [🖥️ Share] │
│  [⚙️ Settings] [📝 Notes] [🚨 Emergency]       │
└────────────────────────────────────────────────┘

Side Panel (Collapsible):
- Chat (text alongside video)
- Session notes
- Resources shared by therapist
- Mood check-in
```

**Features**:
- WebRTC video streaming
- Screen sharing capability
- Virtual backgrounds
- Noise cancellation
- Network quality indicator
- Auto-reconnect on disconnect
- Session recording (with consent)
- Real-time captioning
- Emergency button (connects to crisis line)
- Session notes (for both parties)
- In-session chat
- File/resource sharing

**Components**:
- `<VideoSessionLayout />`
- `<VideoPlayer />`
- `<LocalVideoPreview />`
- `<VideoControls />`
- `<SessionTimer />`
- `<ChatPanel />`
- `<NotesPanel />`
- `<ScreenShareControls />`
- `<EmergencyButton />`
- `<NetworkQualityIndicator />`

#### Voice Session (/session/voice/[sessionId])

Similar to video but:
- Audio waveform visualization instead of video
- Larger therapist avatar
- Focus on audio controls
- Background music/white noise option
- Audio quality settings

**Components**:
- `<VoiceSessionLayout />`
- `<AudioWaveform />`
- `<AudioControls />`
- `<TherapistAvatar />`
- `<SessionTimer />`
- `<ChatPanel />` (optional)

---

### 11. Support Pages (/support/*)

#### Support Dashboard (/support/tickets)

**My Tickets View**:
```
┌────────────────────────────────────────────────┐
│  Filter: [All] [Open] [Closed]                 │
│  Sort: [Newest] [Oldest] [Priority]            │
├────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────┐ │
│  │ 🔴 #1234 - Payment Issue                │ │
│  │ Opened: 2 hours ago | Status: Open       │ │
│  │ Last reply: Support Team (1 hour ago)    │ │
│  └──────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────┐ │
│  │ 🟢 #1233 - Schedule Question             │ │
│  │ Opened: Yesterday | Status: Resolved      │ │
│  │ Last reply: You (5 hours ago)            │ │
│  └──────────────────────────────────────────┘ │
├────────────────────────────────────────────────┤
│  [New Ticket] Button                           │
└────────────────────────────────────────────────┘
```

#### Create Ticket (/support/tickets/new)

**Form Fields**:
- Category (Technical, Billing, Clinical, Account, Other)
- Subject
- Description (rich text editor)
- Priority (Low, Medium, High)
- Attachments (screenshots, files)
- Related session (dropdown, optional)

**Auto-suggestions**:
- Search FAQ before creating ticket
- Related articles
- Similar resolved tickets

#### Ticket Details (/support/tickets/[ticketId])

**Layout**:
- Ticket header (ID, status, priority, created date)
- Conversation thread (messages back and forth)
- Attachments
- Resolution notes
- Reply form
- Close ticket button
- Reopen ticket (if closed)
- Satisfaction rating (when resolved)

**Components**:
- `<TicketList />`
- `<TicketCard />`
- `<CreateTicketForm />`
- `<TicketThread />`
- `<TicketMessage />`
- `<TicketReplyForm />`
- `<AttachmentUpload />`
- `<SatisfactionRating />`

#### FAQ Page (/support/faq)

**Categories**:
- Getting Started
- Account & Billing
- Booking & Sessions
- Technical Issues
- Privacy & Security
- Crisis Support

**Features**:
- Search bar
- Expandable accordion
- "Was this helpful?" feedback
- Contact support if not resolved
- Related articles

**Components**:
- `<FAQSearch />`
- `<FAQCategories />`
- `<FAQAccordion />`
- `<FAQItem />`
- `<HelpfulFeedback />`

---

### 12. Therapist Portal (/therapist-portal/*)

#### Therapist Registration (/therapist-portal/register)

**Multi-Step Form**:

**Step 1: Account Creation**
- Email, password
- First name, last name
- Phone number

**Step 2: Professional Information**
- License number
- License state
- License expiry date
- Professional title
- Years of experience
- Specializations (multi-select)
- Languages spoken

**Step 3: Education & Certifications**
- Degrees (institution, year, field)
- Certifications
- Professional memberships

**Step 4: Profile Setup**
- Profile photo
- Bio (500-1000 words)
- Therapeutic approach
- Ideal client description

**Step 5: Pricing & Availability**
- Hourly rate
- Accept insurance? (Y/N)
- Insurance providers list
- Weekly availability schedule
- Session durations offered

**Step 6: Verification Documents**
- Upload license (front/back)
- Upload certifications
- Upload degree
- Government ID

**Step 7: Legal & Compliance**
- Terms of service
- HIPAA training acknowledgment
- Professional liability insurance proof
- Background check consent

**Step 8: Banking (Stripe Connect)**
- Connect Stripe account for payouts
- Bank details
- Tax information (W-9)

**Components**:
- `<TherapistRegistrationWizard />`
- `<ProfessionalInfoForm />`
- `<EducationForm />`
- `<ProfileSetupForm />`
- `<AvailabilityScheduler />`
- `<DocumentUpload />`
- `<StripeConnectButton />`
- `<LegalAgreements />`

#### Therapist Dashboard (/therapist-portal/dashboard)

**Quick Stats**:
- Upcoming sessions today
- Total active clients
- This week's earnings
- Average rating
- New bookings
- Pending reviews

**Sections**:
1. **Today's Schedule**
   - Session cards with client names
   - Time, duration, type
   - Quick actions (start session, cancel, reschedule)
   - Notes from previous sessions

2. **Recent Activity**
   - New booking requests
   - Client messages
   - Reviews received
   - Payment notifications

3. **Performance Metrics**
   - Session completion rate
   - Client retention rate
   - Average session rating
   - Response time

4. **Quick Actions**
   - Update availability
   - Block time off
   - View earnings
   - Manage profile

**Components**:
- `<TherapistDashboardLayout />`
- `<QuickStatsCards />`
- `<TodaySchedule />`
- `<SessionCard />`
- `<ActivityFeed />`
- `<PerformanceCharts />`

#### Clients Page (/therapist-portal/clients)

**Client List View**:
```
┌────────────────────────────────────────────────┐
│  Search: [____________]  Filter: [All] [Active]│
│  Sort: [Name] [Last Session] [Next Session]    │
├────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────┐ │
│  │ [Photo] John Doe                         │ │
│  │         Active Client                     │ │
│  │         Last Session: 3 days ago          │ │
│  │         Next Session: Tomorrow, 2 PM      │ │
│  │         Total Sessions: 8                 │ │
│  │         [View Profile] [Message] [Notes]  │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

**Client Profile (Detail View)**:
- Personal information (name, age, contact)
- Session history timeline
- Progress notes (encrypted)
- Treatment plan
- Goals and objectives
- Assessment scores over time
- Crisis history (if any)
- Billing history
- Communication log
- Files/documents shared

**Components**:
- `<ClientList />`
- `<ClientCard />`
- `<ClientProfile />`
- `<SessionHistory />`
- `<ProgressNotes />`
- `<TreatmentPlan />`
- `<GoalsTracker />`
- `<AssessmentCharts />`

#### Schedule Page (/therapist-portal/schedule)

**Calendar View** (Week/Month):
- Color-coded sessions
- Available time blocks (green)
- Booked sessions (blue)
- Blocked time (red)
- Tentative bookings (yellow)

**Features**:
- Drag-and-drop to reschedule
- Click to view session details
- Block time off
- Set recurring availability
- Sync with Google Calendar
- Set buffer time between sessions
- Set max sessions per day

**Sidebar**:
- Upcoming sessions list
- Booking requests (pending)
- Calendar integrations

**Components**:
- `<ScheduleCalendar />`
- `<CalendarView />`
- `<SessionSlot />`
- `<AvailabilityEditor />`
- `<BlockTimeModal />`
- `<BookingRequestsList />`
- `<CalendarSync />`

#### Sessions Page (/therapist-portal/sessions)

**Views**:
- Today
- This Week
- Past Sessions
- Cancelled Sessions

**Session List Item**:
```
┌────────────────────────────────────────────────┐
│  📅 Mon, Feb 12, 2026 - 2:00 PM               │
│  👤 Jane Smith (Video Session)                 │
│  ⏱️ Duration: 60 minutes                       │
│  📝 Session #5 - Anxiety Management            │
│  💬 Pre-session notes: "Feeling stressed..."   │
│  [Start Session] [View Notes] [Reschedule]    │
└────────────────────────────────────────────────┘
```

**Session Detail**:
- Client info
- Session date, time, duration
- Session type (video/voice/chat)
- Pre-session notes from client
- Previous session summary
- Treatment plan reference
- Goals for this session
- Crisis alerts (if any)
- Start session button

**Post-Session**:
- Session notes form
- Progress assessment
- Homework assigned
- Next session scheduling
- Invoice generation

**Components**:
- `<SessionsList />`
- `<SessionCard />`
- `<SessionDetail />`
- `<PreSessionBrief />`
- `<PostSessionForm />`
- `<ProgressAssessment />`

#### Earnings Page (/therapist-portal/earnings)

**Summary**:
- Total earnings (all-time)
- This month's earnings
- Last month's earnings
- Average per session
- Pending payouts
- Next payout date

**Charts**:
- Earnings over time (line chart)
- Earnings by client (pie chart)
- Sessions completed (bar chart)

**Transactions Table**:
| Date | Client | Session Type | Amount | Status | Invoice |
|------|--------|-------------|--------|--------|---------|
| 2/12 | John D | Video - 60min | $120 | Paid | 📄 |
| 2/11 | Jane S | Voice - 45min | $90 | Pending | 📄 |

**Filters**:
- Date range
- Payment status (paid, pending, refunded)
- Client
- Session type

**Export Options**:
- Download CSV
- Download PDF report
- Email to accountant

**Components**:
- `<EarningsSummary />`
- `<EarningsCharts />`
- `<TransactionTable />`
- `<PayoutSchedule />`
- `<ExportButtons />`
- `<TaxDocuments />`

#### Therapist Profile (/therapist-portal/profile)

**Edit Mode**:
All the information from registration, editable:
- Profile photo
- Bio
- Specializations
- Credentials
- Availability
- Pricing
- Insurance
- Languages

**Preview Mode**:
- How clients see the profile
- Toggle between edit and preview

**Components**:
- `<TherapistProfileEditor />`
- `<ProfilePreview />`
- `<CredentialsManager />`
- `<SpecializationsEditor />`
- `<PricingEditor />`

#### Therapist Settings (/therapist-portal/settings)

**Sections**:
1. Account Settings
2. Notification Preferences
3. Session Preferences
   - Auto-accept bookings
   - Cancellation policy
   - Session recording defaults
   - No-show policy
4. Integrations
   - Calendly
   - Google Calendar
   - Zoom
   - EHR systems
5. Billing & Payouts
   - Bank account
   - Tax forms
   - Payout schedule

**Components**:
- `<TherapistSettingsTabs />`
- `<SessionPreferencesForm />`
- `<IntegrationsManager />`
- `<PayoutSettings />`

---

### 13. Admin Panel (/admin/*)

#### Admin Dashboard (/admin/dashboard)

**Key Metrics**:
- Total Users (clients, therapists, guests)
- Active Sessions (real-time)
- Revenue (today, week, month)
- New Registrations (chart)
- Crisis Alerts (count, severity)
- Platform Health (uptime, errors)

**Charts**:
- User growth over time
- Session volume (AI vs human)
- Revenue trends
- Therapist utilization
- Geographic distribution

**Recent Activity**:
- New user registrations
- Therapist verification requests
- Payment transactions
- Crisis alerts
- Support tickets

**Quick Actions**:
- Verify pending therapists
- Review crisis logs
- View flagged sessions
- Broadcast announcement
- System maintenance mode

**Components**:
- `<AdminDashboardLayout />`
- `<MetricsCards />`
- `<AnalyticsCharts />`
- `<RecentActivityFeed />`
- `<QuickActionsPanel />`

#### Users Management (/admin/users)

**User List**:
- Search by name, email, ID
- Filters (role, status, date joined)
- Sort options
- Bulk actions (export, suspend, delete)

**User Card**:
- Avatar, name, email
- Role badge
- Account status (active, suspended, deleted)
- Join date
- Last login
- Total sessions
- Subscription tier
- Quick actions (view, edit, suspend, delete)

**User Detail View**:
- All user information
- Activity log
- Session history
- Payment history
- Support tickets
- Crisis logs (if any)
- Edit capabilities
- Audit trail

**Components**:
- `<UserList />`
- `<UserCard />`
- `<UserDetailView />`
- `<UserFilters />`
- `<BulkActions />`
- `<ActivityLog />`

#### Therapists Management (/admin/therapists)

**Pending Verifications**:
- List of therapists awaiting verification
- Documents to review (license, certs, ID)
- Approve/reject with notes
- Request additional documents

**Active Therapists**:
- List with filters
- Performance metrics
- Client feedback
- Session statistics
- Revenue contribution

**Therapist Detail**:
- All profile information
- Verification status and documents
- Client roster
- Session history
- Earnings summary
- Reviews and ratings
- Suspend/deactivate options

**Components**:
- `<TherapistVerificationQueue />`
- `<TherapistList />`
- `<TherapistDetailView />`
- `<DocumentReviewer />`
- `<VerificationActions />`

#### Sessions Management (/admin/sessions)

**Live Sessions Monitor**:
- Real-time view of ongoing sessions
- AI sessions count
- Human therapist sessions count
- Crisis alerts (highlighted)
- Join session capability (emergency only)

**Session History**:
- Search and filter
- Session details
- Participants
- Duration
- Issues/flags
- Review transcripts (with proper authorization)

**Components**:
- `<LiveSessionsMonitor />`
- `<SessionList />`
- `<SessionDetailView />`
- `<CrisisAlertBanner />`

#### Payments Management (/admin/payments)

**Transaction List**:
- All payment transactions
- Filters (status, date, amount range, user)
- Export capabilities
- Refund management

**Analytics**:
- Revenue trends
- Failed payments
- Refund rate
- Average transaction value
- Payment method distribution

**Stripe Dashboard Link**:
- Direct link to Stripe for detailed payment info

**Components**:
- `<PaymentTransactionList />`
- `<PaymentFilters />`
- `<RevenueCharts />`
- `<RefundManager />`

#### Crisis Logs (/admin/crisis-logs)

**Critical Alerts Dashboard**:
- Real-time crisis detections
- Severity levels (color-coded)
- Unresolved vs resolved
- Escalation status

**Crisis Log Entry**:
- Timestamp
- User information (anonymized option)
- Session details
- Crisis type (suicide, self-harm, violence)
- Severity score
- Triggering content (encrypted, limited access)
- Actions taken
- Resolution status
- Assigned responder

**Filters**:
- Date range
- Severity
- Crisis type
- Resolved status
- Escalation level

**Actions**:
- Assign to crisis responder
- Escalate to authorities
- Mark as resolved
- Add follow-up notes
- Generate report

**Components**:
- `<CrisisLogsDashboard />`
- `<CrisisLogList />`
- `<CrisisLogDetail />`
- `<SeverityIndicator />`
- `<EscalationActions />`
- `<CrisisReports />`

#### Analytics (/admin/analytics)

**Dashboards**:
1. **User Analytics**
   - New users over time
   - User retention
   - Churn rate
   - User demographics

2. **Session Analytics**
   - Total sessions
   - AI vs human ratio
   - Average session duration
   - Session completion rate
   - Peak usage times

3. **Revenue Analytics**
   - MRR (Monthly Recurring Revenue)
   - ARR (Annual Recurring Revenue)
   - Revenue per user
   - Subscription distribution
   - Payment success rate

4. **Therapist Analytics**
   - Therapist utilization
   - Average rating by therapist
   - Session load distribution
   - Earnings distribution

5. **Platform Health**
   - Uptime
   - Error rates
   - API response times
   - Database performance
   - WebSocket connections

**Export & Reports**:
- Schedule automated reports
- Custom date ranges
- Export to CSV/PDF
- Share with stakeholders

**Components**:
- `<AnalyticsDashboard />`
- `<CustomDateRangePicker />`
- `<ChartTypes />` (line, bar, pie, heatmap)
- `<DataTable />`
- `<ExportOptions />`
- `<ReportScheduler />`

---

## Global Components (Shared Across Pages)

### Navigation Components
- `<Header />` - Main site header
- `<Navbar />` - Navigation bar
- `<Footer />` - Site footer
- `<Sidebar />` - Collapsible sidebar
- `<MobileMenu />` - Mobile navigation
- `<Breadcrumbs />` - Navigation breadcrumbs

### UI Components
- `<Button />` - Various button variants
- `<Input />` - Form inputs
- `<TextArea />` - Multi-line text input
- `<Select />` - Dropdown select
- `<Checkbox />` - Checkbox input
- `<Radio />` - Radio button
- `<Switch />` - Toggle switch
- `<Modal />` - Modal dialog
- `<Drawer />` - Side drawer
- `<Tooltip />` - Tooltip
- `<Popover />` - Popover
- `<Card />` - Content card
- `<Badge />` - Status badge
- `<Avatar />` - User avatar
- `<Spinner />` - Loading spinner
- `<ProgressBar />` - Progress indicator
- `<Tabs />` - Tab navigation
- `<Accordion />` - Collapsible content
- `<Alert />` - Alert messages
- `<Toast />` - Toast notifications

### Form Components
- `<Form />` - Form wrapper with validation
- `<FormField />` - Form field container
- `<FormLabel />` - Form label
- `<FormError />` - Error message
- `<FormHelperText />` - Helper text
- `<FileUpload />` - File upload
- `<ImageUpload />` - Image upload with preview
- `<DatePicker />` - Date picker
- `<TimePicker />` - Time picker
- `<DateTimePicker />` - Date and time picker
- `<ColorPicker />` - Color picker
- `<RichTextEditor />` - WYSIWYG editor

### Data Display
- `<Table />` - Data table
- `<DataGrid />` - Advanced data grid
- `<List />` - List container
- `<ListItem />` - List item
- `<EmptyState />` - No data placeholder
- `<Skeleton />` - Loading skeleton
- `<Chart />` - Chart wrapper (Chart.js/Recharts)

### Layout Components
- `<Container />` - Content container
- `<Grid />` - Grid layout
- `<Flex />` - Flexbox container
- `<Spacer />` - Spacing element
- `<Divider />` - Visual divider
- `<Section />` - Page section

### Feedback Components
- `<ConfirmDialog />` - Confirmation dialog
- `<ErrorBoundary />` - Error boundary
- `<LoadingOverlay />` - Full-page loading
- `<SuccessMessage />` - Success feedback
- `<ErrorMessage />` - Error feedback

### Specialized Components
- `<CrisisButton />` - Emergency crisis button (sticky)
- `<ChatBubble />` - Message bubble
- `<TherapistAvailability />` - Availability indicator
- `<SessionStatus />` - Session status badge
- `<RatingStars />` - Star rating display/input
- `<PriceDisplay />` - Formatted price display
- `<UserOnlineStatus />` - Online status indicator
- `<NotificationBell />` - Notification icon with count
- `<SearchBar />` - Global search
- `<CalendarWidget />` - Mini calendar
- `<VideoThumbnail />` - Video preview
- `<AudioPlayer />` - Audio player

---

## Responsive Design Breakpoints

```css
/* Mobile */
@media (max-width: 640px) { }

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }

/* Large Desktop */
@media (min-width: 1280px) { }
```

---

## Accessibility Requirements

All pages must meet WCAG 2.1 AA standards:
- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA labels
- Color contrast ratio ≥ 4.5:1
- Focus indicators
- Alternative text for images
- Semantic HTML
- Skip navigation links
- Error identification and suggestions
- Resizable text (up to 200%)

---

## Performance Targets

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

---

## SEO Considerations

Every public page must have:
- Unique, descriptive `<title>`
- Meta description (150-160 chars)
- Open Graph tags
- Twitter Card tags
- Canonical URL
- Structured data (JSON-LD)
- Semantic HTML headings
- Alt text for images
- XML sitemap inclusion

---

This comprehensive page structure provides the foundation for building Terapitika. Each page is designed with user experience, accessibility, and security in mind.
