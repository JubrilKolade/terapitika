import User from './user.model';
import Therapist from './therapist.model';
import Session from './session.model';
import Message from './message.model';
import GuestSession from './guestSession.model';
import Booking from './booking.model';
import Review from './review.model';
import Payment from './payment.model';
import Subscription from './subscription.model';
import CrisisLog from './crisisLog.model';
import SupportTicket from './supportTicket.model';
import SupportMessage from './supportMessage.model';
import Notification from './notification.model';
import AuditLog from './auditLog.model';
import AIConversation from './aiConversation.model';
import MoodLog from './moodLog.model';
import SystemSetting from './systemSetting.model';

// ── Booking associations ──────────────────────────────────────
Booking.belongsTo(User, { foreignKey: 'client_id', as: 'client' });
Booking.belongsTo(Therapist, { foreignKey: 'therapist_id', as: 'therapist' });
Booking.belongsTo(Session, { foreignKey: 'session_id', as: 'session' });

// ── Review associations ───────────────────────────────────────
Review.belongsTo(User, { foreignKey: 'client_id', as: 'client' });
Review.belongsTo(Therapist, { foreignKey: 'therapist_id', as: 'therapist' });
Review.belongsTo(Session, { foreignKey: 'session_id', as: 'session' });
Therapist.hasMany(Review, { foreignKey: 'therapist_id', as: 'reviews' });

// ── Payment associations ─────────────────────────────────────
Payment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Payment.belongsTo(Therapist, { foreignKey: 'therapist_id', as: 'therapist' });
Payment.belongsTo(Session, { foreignKey: 'session_id', as: 'session' });
User.hasMany(Payment, { foreignKey: 'user_id', as: 'payments' });

// ── Subscription associations ────────────────────────────────
Subscription.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(Subscription, { foreignKey: 'user_id', as: 'subscription' });

// ── CrisisLog associations ──────────────────────────────────
CrisisLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
CrisisLog.belongsTo(Session, { foreignKey: 'session_id', as: 'session' });
CrisisLog.belongsTo(Message, { foreignKey: 'message_id', as: 'message' });

// ── SupportTicket associations ──────────────────────────────
SupportTicket.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
SupportTicket.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });
SupportTicket.hasMany(SupportMessage, { foreignKey: 'ticket_id', as: 'messages' });
SupportMessage.belongsTo(SupportTicket, { foreignKey: 'ticket_id', as: 'ticket' });
SupportMessage.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

// ── Notification associations ────────────────────────────────
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });

// ── AuditLog associations ────────────────────────────────────
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ── AIConversation associations ──────────────────────────────
AIConversation.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
AIConversation.belongsTo(GuestSession, { foreignKey: 'guest_session_id', as: 'guestSession' });
AIConversation.belongsTo(Session, { foreignKey: 'session_id', as: 'session' });

// ── MoodLog associations ─────────────────────────────────────
MoodLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(MoodLog, { foreignKey: 'user_id', as: 'mood_logs' });

// Export all models
export {
  User,
  Therapist,
  Session,
  Message,
  GuestSession,
  Booking,
  Review,
  Payment,
  Subscription,
  CrisisLog,
  SupportTicket,
  SupportMessage,
  Notification,
  AuditLog,
  AIConversation,
  MoodLog,
  SystemSetting,
};

// Initialize all model associations
export function initializeModels(): void {
  console.log('✓ All models initialized (15 models)');
}

// Sync all models (development only)
export async function syncModels(force = false): Promise<void> {
  try {
    // Sync in dependency order
    await User.sync({ force });
    await Therapist.sync({ force });
    await GuestSession.sync({ force });
    await Session.sync({ force });
    await Message.sync({ force });
    await Booking.sync({ force });
    await Review.sync({ force });
    await Payment.sync({ force });
    await Subscription.sync({ force });
    await CrisisLog.sync({ force });
    await SupportTicket.sync({ force });
    await SupportMessage.sync({ force });
    await Notification.sync({ force });
    await AuditLog.sync({ force });
    await AIConversation.sync({ force });
    await MoodLog.sync({ force });
    await SystemSetting.sync({ force });
    console.log('✓ All models synchronized');
  } catch (error) {
    console.error('✗ Model synchronization failed:', error);
    throw error;
  }
}

export default {
  User, Therapist, Session, Message, GuestSession,
  Booking, Review, Payment, Subscription, CrisisLog,
  SupportTicket, SupportMessage, Notification, AuditLog, AIConversation, MoodLog, SystemSetting,
  initializeModels, syncModels,
};