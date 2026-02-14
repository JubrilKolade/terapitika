import { User } from '../models';
import { UserRole, IUser } from '../types';
import logger from '../utils/logger';
import { Op } from 'sequelize';

/**
 * Get user by ID
 */
export const getUserById = async (userId: string): Promise<IUser | null> => {
    const user = await User.findByPk(userId, {
        attributes: { exclude: ['password_hash'] },
    });
    return user ? (user.toJSON() as IUser) : null;
};

/**
 * Update user profile
 */
export const updateProfile = async (
    userId: string,
    updates: Partial<{
        first_name: string;
        last_name: string;
        phone: string;
        date_of_birth: Date;
        gender: string;
        profile_picture_url: string;
    }>
): Promise<IUser> => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    const allowedFields = [
        'first_name', 'last_name', 'phone',
        'date_of_birth', 'gender', 'profile_picture_url',
    ] as const;

    const safeUpdates: Record<string, any> = {};
    for (const field of allowedFields) {
        if (updates[field] !== undefined) {
            safeUpdates[field] = updates[field];
        }
    }

    await user.update(safeUpdates);
    logger.info(`Profile updated for user: ${userId}`);
    return user.toJSON() as IUser;
};

/**
 * Update profile picture
 */
export const updateProfilePicture = async (userId: string, pictureUrl: string): Promise<string> => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    user.profile_picture_url = pictureUrl;
    await user.save();
    logger.info(`Profile picture updated for user: ${userId}`);
    return pictureUrl;
};

/**
 * Update user preferences
 */
export const updatePreferences = async (userId: string, preferences: any): Promise<any> => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    user.preferences = { ...user.preferences, ...preferences };
    await user.save();
    logger.info(`Preferences updated for user: ${userId}`);
    return user.preferences;
};

/**
 * Get user statistics
 */
export const getUserStats = async (userId: string): Promise<{
    totalSessions: number;
    lastSessionAt: Date | null;
    memberSince: Date;
    isVerified: boolean;
}> => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    const { Session } = require('../models');
    const totalSessions = await Session.count({ where: { client_id: userId } });
    const lastSession = await Session.findOne({
        where: { client_id: userId },
        order: [['created_at', 'DESC']],
    });

    return {
        totalSessions,
        lastSessionAt: lastSession?.started_at || null,
        memberSince: user.created_at,
        isVerified: user.is_verified,
    };
};

/**
 * Deactivate user account
 */
export const deactivateAccount = async (userId: string): Promise<void> => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    user.is_active = false;
    await user.save();
    logger.info(`Account deactivated: ${userId}`);
};

/**
 * Permanently delete user account
 */
export const deleteAccount = async (userId: string): Promise<void> => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    await user.softDelete();
    logger.info(`Account deleted: ${userId}`);
};

/**
 * Search users (admin only)
 */
export const searchUsers = async (
    query: string,
    role?: UserRole,
    page: number = 1,
    limit: number = 20
): Promise<{ users: IUser[]; total: number }> => {
    const offset = (page - 1) * limit;
    const where: any = {
        [Op.or]: [
            { email: { [Op.iLike]: `%${query}%` } },
            { first_name: { [Op.iLike]: `%${query}%` } },
            { last_name: { [Op.iLike]: `%${query}%` } },
        ],
    };
    if (role) where.role = role;
    const { count, rows } = await User.findAndCountAll({
        where,
        attributes: { exclude: ['password_hash'] },
        limit, offset,
        order: [['created_at', 'DESC']],
    });
    return { users: rows.map(u => u.toJSON() as IUser), total: count };
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (
    page: number = 1,
    limit: number = 20,
    role?: UserRole
): Promise<{ users: IUser[]; total: number }> => {
    const offset = (page - 1) * limit;
    const where: any = {};
    if (role) where.role = role;
    const { count, rows } = await User.findAndCountAll({
        where,
        attributes: { exclude: ['password_hash'] },
        limit, offset,
        order: [['created_at', 'DESC']],
    });
    return { users: rows.map(u => u.toJSON() as IUser), total: count };
};
