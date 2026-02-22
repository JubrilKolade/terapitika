import { Therapist, User } from '../models';
import { ITherapist, LicenseVerificationStatus, UserRole } from '../types';
import logger from '../utils/logger';
import { Op } from 'sequelize';
import sequelize from '../config/database';

interface TherapistRegistrationData {
    licenseNumber: string;
    licenseState: string;
    licenseExpiry: string;
    specializations: string[];
    bio?: string;
    yearsOfExperience?: number;
    education?: any[];
    certifications?: any[];
    languages?: string[];
    hourlyRate?: number;
    acceptsInsurance?: boolean;
    insuranceProviders?: string[];
    videoEnabled?: boolean;
    voiceEnabled?: boolean;
    chatEnabled?: boolean;
}

interface TherapistSearchFilters {
    specialization?: string;
    minRating?: number;
    maxRate?: number;
    languages?: string[];
    acceptsInsurance?: boolean;
    isAcceptingClients?: boolean;
}

/**
 * Register as a therapist
 */
export const registerTherapist = async (
    userId: string,
    data: TherapistRegistrationData
): Promise<ITherapist> => {
    const existing = await Therapist.findOne({ where: { user_id: userId } });
    if (existing) throw new Error('Therapist profile already exists');

    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    const therapist = await Therapist.create({
        user_id: userId,
        license_number: data.licenseNumber,
        license_state: data.licenseState,
        license_expiry: new Date(data.licenseExpiry),
        license_verification_status: LicenseVerificationStatus.PENDING,
        specializations: data.specializations || [],
        bio: data.bio,
        years_of_experience: data.yearsOfExperience,
        education: data.education,
        certifications: data.certifications,
        languages: data.languages || ['English'],
        hourly_rate: data.hourlyRate,
        accepts_insurance: data.acceptsInsurance || false,
        insurance_providers: data.insuranceProviders,
        video_enabled: data.videoEnabled ?? true,
        voice_enabled: data.voiceEnabled ?? true,
        chat_enabled: data.chatEnabled ?? true,
        rating_average: 0,
        rating_count: 0,
        total_sessions: 0,
        is_accepting_clients: false,
    });

    user.role = UserRole.THERAPIST;
    await user.save();

    logger.info(`Therapist registered: ${userId}`);
    return therapist.toJSON() as ITherapist;
};

/**
 * Get therapist profile by user ID
 */
export const getTherapistByUserId = async (userId: string): Promise<ITherapist | null> => {
    const therapist = await Therapist.findOne({
        where: { user_id: userId },
        include: [{ model: User, as: 'user', attributes: { exclude: ['password_hash'] } }],
    });
    return therapist ? (therapist.toJSON() as ITherapist) : null;
};

/**
 * Get therapist profile by therapist ID
 */
export const getTherapistById = async (therapistId: string): Promise<ITherapist | null> => {
    const therapist = await Therapist.findByPk(therapistId, {
        include: [{ model: User, as: 'user', attributes: { exclude: ['password_hash'] } }],
    });
    return therapist ? (therapist.toJSON() as ITherapist) : null;
};

/**
 * Update therapist profile
 */
export const updateProfile = async (
    therapistId: string,
    updates: Partial<TherapistRegistrationData>
): Promise<ITherapist> => {
    const therapist = await Therapist.findByPk(therapistId);
    if (!therapist) throw new Error('Therapist not found');

    const allowedFields: Record<string, string> = {
        bio: 'bio',
        specializations: 'specializations',
        yearsOfExperience: 'years_of_experience',
        education: 'education',
        certifications: 'certifications',
        languages: 'languages',
        hourlyRate: 'hourly_rate',
        acceptsInsurance: 'accepts_insurance',
        insuranceProviders: 'insurance_providers',
        videoEnabled: 'video_enabled',
        voiceEnabled: 'voice_enabled',
        chatEnabled: 'chat_enabled',
    };

    const safeUpdates: Record<string, any> = {};
    for (const [camelKey, snakeKey] of Object.entries(allowedFields)) {
        if ((updates as any)[camelKey] !== undefined) {
            safeUpdates[snakeKey] = (updates as any)[camelKey];
        }
    }

    await therapist.update(safeUpdates);
    logger.info(`Therapist profile updated: ${therapistId}`);
    return therapist.toJSON() as ITherapist;
};

/**
 * Search therapists
 */
export const searchTherapists = async (
    filters: TherapistSearchFilters,
    page: number = 1,
    limit: number = 20
): Promise<{ therapists: ITherapist[]; total: number }> => {
    const offset = (page - 1) * limit;
    const where: any = {
        license_verification_status: LicenseVerificationStatus.VERIFIED,
    };

    if (filters.specialization) {
        where.specializations = { [Op.contains]: [filters.specialization] };
    }
    if (filters.minRating !== undefined) where.rating_average = { [Op.gte]: filters.minRating };
    if (filters.maxRate !== undefined) where.hourly_rate = { [Op.lte]: filters.maxRate };
    if (filters.acceptsInsurance) where.accepts_insurance = true;
    if (filters.isAcceptingClients) where.is_accepting_clients = true;

    const { count, rows } = await Therapist.findAndCountAll({
        where,
        include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name', 'profile_picture_url'] }],
        limit, offset,
        order: [['rating_average', 'DESC']],
    });
    return { therapists: rows.map(t => t.toJSON() as ITherapist), total: count };
};

/**
 * Get therapist stats
 */
export const getTherapistStats = async (therapistId: string): Promise<{
    totalSessions: number;
    ratingAverage: number;
    ratingCount: number;
    isAcceptingClients: boolean;
}> => {
    const therapist = await Therapist.findByPk(therapistId);
    if (!therapist) throw new Error('Therapist not found');
    return {
        totalSessions: therapist.total_sessions,
        ratingAverage: therapist.rating_average,
        ratingCount: therapist.rating_count,
        isAcceptingClients: therapist.is_accepting_clients,
    };
};

/**
 * Get availability schedule
 */
export const getAvailability = async (therapistId: string): Promise<any> => {
    const therapist = await Therapist.findByPk(therapistId);
    if (!therapist) throw new Error('Therapist not found');
    return therapist.availability_schedule;
};

/**
 * Update availability schedule
 */
export const updateAvailability = async (
    therapistId: string,
    schedule: any
): Promise<ITherapist> => {
    const therapist = await Therapist.findByPk(therapistId);
    if (!therapist) throw new Error('Therapist not found');
    therapist.availability_schedule = schedule;
    await therapist.save();
    logger.info(`Availability updated for therapist: ${therapistId}`);
    return therapist.toJSON() as ITherapist;
};

/**
 * Upload verification documents
 */
export const uploadVerificationDocuments = async (
    therapistId: string,
    documents: Array<{ type: string; url: string }>
): Promise<ITherapist> => {
    const therapist = await Therapist.findByPk(therapistId);
    if (!therapist) throw new Error('Therapist not found');

    const existingDocs = therapist.verification_documents || [];
    const newDocs = documents.map(doc => ({ ...doc, uploaded_at: new Date() }));
    therapist.verification_documents = [...existingDocs, ...newDocs];
    await therapist.save();
    logger.info(`Documents uploaded for therapist: ${therapistId}`);
    return therapist.toJSON() as ITherapist;
};

/**
 * Get pending verifications (admin)
 */
export const getPendingVerifications = async (
    page: number = 1,
    limit: number = 20
): Promise<{ therapists: ITherapist[]; total: number }> => {
    const offset = (page - 1) * limit;
    const { count, rows } = await Therapist.findAndCountAll({
        where: { license_verification_status: LicenseVerificationStatus.PENDING },
        include: [{ model: User, as: 'user', attributes: { exclude: ['password_hash'] } }],
        limit, offset,
        order: [['created_at', 'ASC']],
    });
    return { therapists: rows.map(t => t.toJSON() as ITherapist), total: count };
};

/**
 * Verify therapist license (admin)
 */
export const verifyLicense = async (
    therapistId: string,
    status: LicenseVerificationStatus,
    notes?: string
): Promise<ITherapist> => {
    const therapist = await Therapist.findByPk(therapistId);
    if (!therapist) throw new Error('Therapist not found');
    therapist.license_verification_status = status;
    if (status === LicenseVerificationStatus.VERIFIED) {
        therapist.is_accepting_clients = true;
    } else if (status === LicenseVerificationStatus.REJECTED) {
        therapist.is_accepting_clients = false;
    }
    await therapist.save();
    logger.info(`Therapist ${therapistId} verification updated to: ${status}`);
    return therapist.toJSON() as ITherapist;
};
/**
 * Get therapist clients
 */
export const getClients = async (therapistId: string, page: number = 1, limit: number = 20) => {
    const { Booking, User } = require('../models');
    const offset = (page - 1) * limit;

    const { count, rows } = await Booking.findAndCountAll({
        where: { therapist_id: therapistId },
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('client_id')), 'client_id']],
        include: [{
            model: User,
            as: 'client',
            attributes: ['id', 'first_name', 'last_name', 'email', 'profile_picture_url']
        }],
        limit, offset,
    });

    return { clients: rows.map((r: any) => r.client), total: count };
};

/**
 * Get therapist earnings
 */
export const getEarnings = async (therapistId: string) => {
    const { Payment } = require('../models');
    const { PaymentStatus } = require('../types');

    const successfulPayments = await Payment.findAll({
        where: {
            therapist_id: therapistId,
            status: PaymentStatus.SUCCEEDED,
        },
    });

    const totalEarnings = successfulPayments.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);
    const recentTransactions = successfulPayments.slice(0, 10);

    return {
        totalEarnings,
        currency: successfulPayments[0]?.currency || 'USD',
        recentTransactions,
    };
};
