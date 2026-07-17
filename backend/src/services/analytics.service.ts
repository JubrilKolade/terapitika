import { MoodLog, User, Session } from '../models';
import { Op } from 'sequelize';
import logger from '../utils/logger';

/**
 * Log user mood
 */
export const logMood = async (userId: string, data: {
    mood: number;
    energyLevel?: number;
    anxietyLevel?: number;
    notes?: string;
}) => {
    const log = await MoodLog.create({
        user_id: userId,
        mood: data.mood,
        energy_level: data.energyLevel,
        anxiety_level: data.anxietyLevel,
        notes: data.notes,
        logged_at: new Date(),
    });
    logger.info(`Mood logged for user ${userId}: mood=${data.mood}`);
    return log;
};

/**
 * Get mood trends for a user
 */
export const getMoodTrends = async (userId: string, startDate?: Date, endDate?: Date) => {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default 30 days
    const end = endDate || new Date();

    const logs = await MoodLog.findAll({
        where: {
            user_id: userId,
            logged_at: {
                [Op.between]: [start, end],
            },
        },
        order: [['logged_at', 'ASC']],
    });

    return logs;
};

/**
 * Get user progress / overall analytics
 */
export const getUserProgress = async (userId: string) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    // Count sessions
    const sessionCount = await Session.count({
        where: { client_id: userId },
    });

    // Get last 7 mood logs to see current status
    const recentMoods = await MoodLog.findAll({
        where: { user_id: userId },
        limit: 7,
        order: [['logged_at', 'DESC']],
    });

    const averageMood = recentMoods.length > 0
        ? recentMoods.reduce((acc, curr) => acc + curr.mood, 0) / recentMoods.length
        : null;

    return {
        totalSessions: sessionCount,
        averageRecentMood: averageMood,
        recentMoods,
        memberSince: user.created_at,
    };
};
