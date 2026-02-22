import { Request } from 'express';

// User types
export enum UserRole {
  GUEST = 'guest',
  CLIENT = 'client',
  THERAPIST = 'therapist',
  ADMIN = 'admin',
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

export interface IUser {
  id: string;
  email: string;
  password_hash?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: Date;
  gender?: string;
  profile_picture_url?: string;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  auth_provider: AuthProvider;
  oauth_id?: string;
  emergency_contact?: EmergencyContact;
  preferences?: UserPreferences;
  stripe_customer_id?: string;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
  deleted_at?: Date;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  notification_settings: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
}

// Therapist types
export enum LicenseVerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export interface ITherapist {
  id: string;
  user_id: string;
  license_number: string;
  license_state: string;
  license_expiry: Date;
  license_verification_status: LicenseVerificationStatus;
  specializations: string[];
  bio?: string;
  years_of_experience?: number;
  education?: Education[];
  certifications?: Certification[];
  languages: string[];
  hourly_rate?: number;
  accepts_insurance: boolean;
  insurance_providers?: string[];
  availability_schedule?: AvailabilitySchedule;
  video_enabled: boolean;
  voice_enabled: boolean;
  chat_enabled: boolean;
  rating_average: number;
  rating_count: number;
  total_sessions: number;
  is_accepting_clients: boolean;
  verification_documents?: VerificationDocument[];
  stripe_account_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
}

export interface Certification {
  name: string;
  issuer: string;
  year: number;
}

export interface AvailabilitySchedule {
  [day: string]: TimeSlot[];
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface VerificationDocument {
  type: string;
  url: string;
  uploaded_at: Date;
}

// Session types
export enum SessionType {
  AI_ONLY = 'ai_only',
  HUMAN_THERAPIST = 'human_therapist',
}

export enum CommunicationMode {
  CHAT = 'chat',
  VOICE = 'voice',
  VIDEO = 'video',
}

export enum SessionStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export interface ISession {
  id: string;
  client_id: string;
  therapist_id?: string;
  session_type: SessionType;
  communication_mode?: CommunicationMode;
  scheduled_at?: Date;
  started_at?: Date;
  ended_at?: Date;
  duration_minutes?: number;
  status: SessionStatus;
  session_notes?: string;
  ai_summary?: string;
  crisis_flags?: CrisisFlag[];
  recording_url?: string;
  transcript_url?: string;
  payment_status?: string;
  payment_amount?: number;
  cancellation_reason?: string;
  cancelled_by?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CrisisFlag {
  timestamp: Date;
  severity: string;
  content: string;
}

// Message types
export enum SenderType {
  CLIENT = 'client',
  THERAPIST = 'therapist',
  AI = 'ai',
  GUEST = 'guest',
}

export enum ContentType {
  TEXT = 'text',
  IMAGE = 'image',
  AUDIO = 'audio',
  FILE = 'file',
}

export interface IMessage {
  id: string;
  session_id: string;
  sender_id?: string;
  sender_type: SenderType;
  content: string;
  content_type: ContentType;
  file_url?: string;
  sentiment_score?: number;
  crisis_detected: boolean;
  crisis_severity?: string;
  ai_flagged: boolean;
  is_edited: boolean;
  edited_at?: Date;
  read_at?: Date;
  created_at: Date;
}

// Guest session types
export interface IGuestSession {
  id: string;
  session_token: string;
  ip_address?: string;
  user_agent?: string;
  message_count: number;
  max_messages: number;
  expires_at: Date;
  created_at: Date;
}

// Booking types
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export interface IBooking {
  id: string;
  client_id: string;
  therapist_id: string;
  session_id?: string;
  scheduled_at: Date;
  duration_minutes: number;
  booking_status: BookingStatus;
  communication_mode: CommunicationMode;
  notes?: string;
  reminder_sent: boolean;
  calendly_event_id?: string;
  zoom_meeting_id?: string;
  twilio_room_sid?: string;
  created_at: Date;
  updated_at: Date;
}

// Payment types
export enum PaymentStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface IPayment {
  id: string;
  user_id: string;
  therapist_id?: string;
  session_id?: string;
  amount: number;
  currency: string;
  payment_method: string;
  stripe_payment_intent_id?: string;
  stripe_charge_id?: string;
  status: PaymentStatus;
  failure_reason?: string;
  refund_amount?: number;
  refunded_at?: Date;
  metadata?: any;
  created_at: Date;
  updated_at: Date;
}

// Subscription types
export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid',
}

export interface ISubscription {
  id: string;
  user_id: string;
  plan_type: string;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  status: SubscriptionStatus;
  current_period_start?: Date;
  current_period_end?: Date;
  cancel_at_period_end: boolean;
  cancelled_at?: Date;
  ai_message_limit?: number;
  ai_messages_used: number;
  monthly_therapist_hours?: number;
  monthly_therapist_hours_used: number;
  created_at: Date;
  updated_at: Date;
}

// Crisis types
export enum CrisisType {
  SUICIDE = 'suicide',
  SELF_HARM = 'self_harm',
  VIOLENCE = 'violence',
  PSYCHOSIS = 'psychosis',
}

export enum CrisisSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface ICrisisLog {
  id: string;
  user_id: string;
  session_id?: string;
  message_id?: string;
  severity: CrisisSeverity;
  crisis_type?: CrisisType;
  detected_by: string;
  content_snippet?: string;
  action_taken?: string;
  escalated_to?: string;
  resolved: boolean;
  resolved_at?: Date;
  resolved_by?: string;
  notes?: string;
  created_at: Date;
}

// Support ticket types
export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export interface ISupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  category?: string;
  priority: string;
  status: TicketStatus;
  assigned_to?: string;
  resolution_notes?: string;
  resolved_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// Notification types
export interface INotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  action_url?: string;
  is_read: boolean;
  read_at?: Date;
  sent_via?: any;
  created_at: Date;
}

// Request types
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

// Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  meta: PaginationMeta;
}

// WebSocket types
export interface SocketUser {
  userId: string;
  socketId: string;
  role: UserRole;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderType: SenderType;
  content: string;
  contentType: ContentType;
  timestamp: Date;
}

export interface TypingIndicator {
  sessionId: string;
  userId: string;
  isTyping: boolean;
}

// JWT Payload types
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
  iat?: number;
  exp?: number;
}