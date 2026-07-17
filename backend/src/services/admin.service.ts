import { User, Therapist, Session, Payment, CrisisLog, Notification, AuditLog } from '../models';
import { UserRole, LicenseVerificationStatus } from '../types';
import logger from '../utils/logger';
import { Op } from 'sequelize';

export const getDashboardAnalytics = async (): Promise<any> => {
    const [totalUsers, totalTherapists, totalSessions, totalRevenue, pendingVerifications, activeCrises] = await Promise.all([
        User.count(),
        Therapist.count(),
        Session.count(),
        Payment.sum('amount', { where: { status: 'succeeded' } }),
        Therapist.count({ where: { license_verification_status: LicenseVerificationStatus.PENDING } }),
        CrisisLog.count({ where: { resolved: false } }),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [newUsersToday, sessionsToday] = await Promise.all([
        User.count({ where: { created_at: { [Op.gte]: today } } }),
        Session.count({ where: { created_at: { [Op.gte]: today } } }),
    ]);

    return {
        totalUsers, totalTherapists, totalSessions,
        totalRevenue: totalRevenue || 0,
        pendingVerifications, activeCrises,
        newUsersToday, sessionsToday,
    };
};

export const getAllUsers = async (page = 1, limit = 20, role?: UserRole): Promise<{ users: any[]; total: number }> => {
    const offset = (page - 1) * limit;
    const where: any = {};
    if (role) where.role = role;

    const { count, rows } = await User.findAndCountAll({
        where, limit, offset,
        attributes: { exclude: ['password_hash'] },
        order: [['created_at', 'DESC']],
    });
    return { users: rows.map(u => u.toJSON()), total: count };
};

export const getUserById = async (userId: string): Promise<any> => {
    const user = await User.findByPk(userId, { attributes: { exclude: ['password_hash'] } });
    if (!user) throw new Error('User not found');
    return user.toJSON();
};

export const updateUser = async (userId: string, updates: any): Promise<any> => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    await user.update(updates);
    return user.toJSON();
};

export const deleteUser = async (userId: string): Promise<void> => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    user.is_active = false;
    user.deleted_at = new Date();
    await user.save();
    logger.info(`Admin deleted user: ${userId}`);
};

export const getPendingVerifications = async (page = 1, limit = 20): Promise<{ therapists: any[]; total: number }> => {
    const offset = (page - 1) * limit;
    const { count, rows } = await Therapist.findAndCountAll({
        where: { license_verification_status: LicenseVerificationStatus.PENDING },
        include: [{ model: User, as: 'user', attributes: { exclude: ['password_hash'] } }],
        limit, offset,
        order: [['created_at', 'ASC']],
    });
    return { therapists: rows.map(t => t.toJSON()), total: count };
};

export const verifyTherapist = async (therapistId: string, status: LicenseVerificationStatus, notes?: string): Promise<any> => {
    const therapist = await Therapist.findByPk(therapistId);
    if (!therapist) throw new Error('Therapist not found');

    therapist.license_verification_status = status;
    if (status === LicenseVerificationStatus.VERIFIED) therapist.is_accepting_clients = true;
    else if (status === LicenseVerificationStatus.REJECTED) therapist.is_accepting_clients = false;
    await therapist.save();

    logger.info(`Therapist ${therapistId} verification: ${status}`);
    return therapist.toJSON();
};

export const getCrisisLogs = async (page = 1, limit = 20, resolved?: boolean): Promise<{ logs: any[]; total: number }> => {
    const offset = (page - 1) * limit;
    const where: any = {};
    if (resolved !== undefined) where.resolved = resolved;

    const { count, rows } = await CrisisLog.findAndCountAll({
        where, limit, offset,
        order: [['created_at', 'DESC']],
        include: [{ model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email'] }],
    });
    return { logs: rows.map(l => l.toJSON()), total: count };
};

export const getAuditLogs = async (page = 1, limit = 50, userId?: string): Promise<{ logs: any[]; total: number }> => {
    const offset = (page - 1) * limit;
    const where: any = {};
    if (userId) where.user_id = userId;

    const { count, rows } = await AuditLog.findAndCountAll({
        where, limit, offset,
        order: [['created_at', 'DESC']],
    });
    return { logs: rows.map(l => l.toJSON()), total: count };
};

export const broadcastNotification = async (title: string, message: string, targetRole?: UserRole): Promise<number> => {
    const where: any = { is_active: true };
    if (targetRole) where.role = targetRole;

    const users = await User.findAll({ where, attributes: ['id'] });
    const notifications = users.map(u => ({
        user_id: u.id,
        type: 'system_broadcast',
        title,
        message,
    }));

    await Notification.bulkCreate(notifications);
    logger.info(`Broadcast sent to ${users.length} users`);
    return users.length;
};
/**
 * Get system settings (admin)
 */
export const getSettings = async (): Promise<any> => {
    const { SystemSetting } = require('../models');
    const settings = await SystemSetting.findAll();
    return settings.reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});
};

/**
 * Update system settings (admin)
 */
export const updateSettings = async (updates: Record<string, any>): Promise<any> => {
    const { SystemSetting } = require('../models');

    for (const [key, value] of Object.entries(updates)) {
        await SystemSetting.upsert({ key, value });
    }

    return getSettings();
};
