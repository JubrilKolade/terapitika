import { Notification } from '../models';
import { INotification } from '../types';
import logger from '../utils/logger';

export const create = async (data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    actionUrl?: string;
    sentVia?: { email?: boolean; push?: boolean; sms?: boolean };
}): Promise<INotification> => {
    const notification = await Notification.create({
        user_id: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        action_url: data.actionUrl,
        sent_via: data.sentVia,
    });
    return notification.toJSON() as INotification;
};

export const getUserNotifications = async (userId: string, page = 1, limit = 20): Promise<{ notifications: INotification[]; total: number }> => {
    const offset = (page - 1) * limit;
    const { count, rows } = await Notification.findAndCountAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']],
        limit, offset,
    });
    return { notifications: rows.map(n => n.toJSON() as INotification), total: count };
};

export const getUnreadNotifications = async (userId: string): Promise<{ notifications: INotification[]; total: number }> => {
    const { count, rows } = await Notification.findAndCountAll({
        where: { user_id: userId, is_read: false },
        order: [['created_at', 'DESC']],
    });
    return { notifications: rows.map(n => n.toJSON() as INotification), total: count };
};

export const markAsRead = async (notificationId: string, userId: string): Promise<void> => {
    const notification = await Notification.findOne({ where: { id: notificationId, user_id: userId } });
    if (!notification) throw new Error('Notification not found');
    await notification.markAsRead();
};

export const markAllAsRead = async (userId: string): Promise<number> => {
    const [count] = await Notification.update(
        { is_read: true, read_at: new Date() },
        { where: { user_id: userId, is_read: false } }
    );
    return count;
};

export const deleteNotification = async (notificationId: string, userId: string): Promise<void> => {
    const count = await Notification.destroy({ where: { id: notificationId, user_id: userId } });
    if (!count) throw new Error('Notification not found');
};

export const getUnreadCount = async (userId: string): Promise<number> => {
    return Notification.count({ where: { user_id: userId, is_read: false } });
};

// Convenience methods
export const notifyBookingConfirmed = async (userId: string, therapistName: string, date: string): Promise<INotification> => {
    return create({ userId, type: 'booking_confirmed', title: 'Booking Confirmed', message: `Your session with ${therapistName} on ${date} has been confirmed.`, actionUrl: '/dashboard/bookings' });
};

export const notifySessionReminder = async (userId: string, therapistName: string, minutesUntil: number): Promise<INotification> => {
    return create({ userId, type: 'session_reminder', title: 'Session Starting Soon', message: `Your session with ${therapistName} starts in ${minutesUntil} minutes.`, actionUrl: '/dashboard/sessions' });
};

export const notifyNewMessage = async (userId: string, senderName: string, sessionId: string): Promise<INotification> => {
    return create({ userId, type: 'message_received', title: 'New Message', message: `${senderName} sent you a message.`, actionUrl: `/chat/${sessionId}` });
};

export const notifyCrisisAlert = async (userId: string, severity: string): Promise<INotification> => {
    return create({ userId, type: 'crisis_alert', title: '⚠️ Crisis Alert', message: `A crisis situation with severity "${severity}" has been detected.`, actionUrl: '/admin/crisis-logs' });
};
