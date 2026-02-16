// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'non-binary' | 'other' | 'prefer-not-to-say';
  timezone?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  CLIENT = 'CLIENT',
  THERAPIST = 'THERAPIST',
  ADMIN = 'ADMIN',
  GUEST = 'GUEST',
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
}

// Therapist Types
export interface Therapist extends User {
  role: UserRole.THERAPIST;
  bio: string;
  specializations: string[];
  licenses: License[];
  experience: number;
  education: Education[];
  languages: string[];
  hourlyRate: number;
  availability: Availability[];
  rating: number;
  totalSessions: number;
  verified: boolean;
  acceptingClients: boolean;
  videoEnabled: boolean;
  voiceEnabled: boolean;
  chatEnabled: boolean;
}

export interface License {
  id: string;
  type: string;
  number: string;
  state: string;
  country: string;
  issueDate: string;
  expiryDate: string;
  verified: boolean;
  documentUrl?: string;
}

export interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  graduationYear: number;
  verified: boolean;
}

export interface Availability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  timezone: string;
}

// Session and Booking Types
export interface Session {
  id: string;
  clientId: string;
  therapistId: string;
  type: SessionType;
  status: SessionStatus;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
  duration: number; // in minutes
  price: number;
  notes?: string;
  rating?: number;
  feedback?: string;
  recordingUrl?: string;
  transcriptUrl?: string;
  createdAt: string;
  updatedAt: string;
  client?: User;
  therapist?: Therapist;
}

export enum SessionType {
  AI_CHAT = 'AI_CHAT',
  AI_VOICE = 'AI_VOICE',
  HUMAN_CHAT = 'HUMAN_CHAT',
  HUMAN_VOICE = 'HUMAN_VOICE',
  HUMAN_VIDEO = 'HUMAN_VIDEO',
}

export enum SessionStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export interface Booking {
  id: string;
  sessionId: string;
  clientId: string;
  therapistId: string;
  startTime: string;
  endTime: string;
  duration: number;
  type: SessionType;
  status: BookingStatus;
  price: number;
  paymentStatus: PaymentStatus;
  paymentIntentId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

// Chat and Message Types
export interface Message {
  id: string;
  sessionId: string;
  senderId: string;
  senderType: 'user' | 'therapist' | 'ai';
  content: string;
  type: MessageType;
  attachments?: Attachment[];
  metadata?: Record<string, any>;
  edited: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  SYSTEM = 'SYSTEM',
}

export interface Attachment {
  id: string;
  messageId: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  type: SessionType;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Crisis Detection Types
export interface CrisisAlert {
  id: string;
  sessionId: string;
  userId: string;
  severity: CrisisSeverity;
  type: CrisisType;
  message: string;
  triggerWords: string[];
  context: string;
  status: CrisisStatus;
  assignedTo?: string;
  resolvedAt?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

export enum CrisisSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum CrisisType {
  SELF_HARM = 'SELF_HARM',
  SUICIDE = 'SUICIDE',
  VIOLENCE = 'VIOLENCE',
  ABUSE = 'ABUSE',
  SUBSTANCE = 'SUBSTANCE',
  OTHER = 'OTHER',
}

export enum CrisisStatus {
  ACTIVE = 'ACTIVE',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
}

// WebRTC and Video/Voice Types
export interface MediaSettings {
  video: boolean;
  audio: boolean;
  screenShare: boolean;
  videoDeviceId?: string;
  audioDeviceId?: string;
}

export interface Participant {
  id: string;
  userId: string;
  userName: string;
  avatar?: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  stream?: MediaStream;
}

export interface CallState {
  roomId: string;
  sessionId: string;
  participants: Participant[];
  localStream?: MediaStream;
  mediaSettings: MediaSettings;
  connectionStatus: ConnectionStatus;
  duration: number;
}

export enum ConnectionStatus {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  RECONNECTING = 'RECONNECTING',
  DISCONNECTED = 'DISCONNECTED',
  FAILED = 'FAILED',
}

// Payment Types
export interface Payment {
  id: string;
  userId: string;
  sessionId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  stripePaymentIntentId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  createdAt: string;
}

// Analytics and Progress Types
export interface UserProgress {
  userId: string;
  totalSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  totalSpent: number;
  averageRating: number;
  moodTrend: MoodEntry[];
  goals: Goal[];
  achievements: Achievement[];
  updatedAt: string;
}

export interface MoodEntry {
  id: string;
  userId: string;
  sessionId?: string;
  mood: number; // 1-10 scale
  energy: number; // 1-10 scale
  anxiety: number; // 1-10 scale
  notes?: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  targetDate?: string;
  progress: number; // 0-100
  status: 'active' | 'completed' | 'abandoned';
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

// Support and Help Types
export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  description: string;
  responses: TicketResponse[];
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export enum TicketCategory {
  TECHNICAL = 'TECHNICAL',
  BILLING = 'BILLING',
  ACCOUNT = 'ACCOUNT',
  THERAPIST = 'THERAPIST',
  SESSION = 'SESSION',
  FEEDBACK = 'FEEDBACK',
  OTHER = 'OTHER',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_RESPONSE = 'WAITING_RESPONSE',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export interface TicketResponse {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  isStaff: boolean;
  attachments?: Attachment[];
  createdAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

export enum NotificationType {
  SESSION_REMINDER = 'SESSION_REMINDER',
  SESSION_CANCELLED = 'SESSION_CANCELLED',
  SESSION_RESCHEDULED = 'SESSION_RESCHEDULED',
  NEW_MESSAGE = 'NEW_MESSAGE',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  THERAPIST_RESPONSE = 'THERAPIST_RESPONSE',
  SYSTEM = 'SYSTEM',
  CRISIS_ALERT = 'CRISIS_ALERT',
}

// Settings Types
export interface UserSettings {
  userId: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  preferences: UserPreferences;
  updatedAt: string;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  sessionReminders: boolean;
  newMessages: boolean;
  promotions: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private';
  showOnlineStatus: boolean;
  allowDataAnalytics: boolean;
  allowRecordings: boolean;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'auto';
  defaultSessionType: SessionType;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  acceptTerms: boolean;
}

export interface BookingFormData {
  therapistId: string;
  sessionType: SessionType;
  date: string;
  time: string;
  duration: number;
  notes?: string;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  timezone?: string;
  avatar?: File;
}
