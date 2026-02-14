import nodemailer from 'nodemailer';
import config from '../config/environment';
import logger from '../utils/logger';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: config.email.smtp.host,
            port: config.email.smtp.port,
            secure: false,
            auth: {
                user: config.email.smtp.user,
                pass: config.email.smtp.password,
            },
        });
    }
    return transporter;
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
    try {
        await getTransporter().sendMail({
            from: config.email.smtp.from || config.email.fromEmail,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
        });
        logger.info(`Email sent to ${options.to}: ${options.subject}`);
    } catch (error) {
        logger.error(`Failed to send email to ${options.to}:`, error);
        throw error;
    }
};

export const sendWelcomeEmail = async (to: string, name: string): Promise<void> => {
    await sendEmail({
        to,
        subject: 'Welcome to Terapitika',
        html: `<h1>Welcome, ${name}!</h1><p>We're glad you're here. Start your mental health journey today.</p>`,
    });
};

export const sendPasswordResetEmail = async (to: string, resetToken: string): Promise<void> => {
    const resetUrl = `${config.appUrl}/auth/reset-password?token=${resetToken}`;
    await sendEmail({
        to,
        subject: 'Reset Your Password - Terapitika',
        html: `<h1>Password Reset</h1><p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
    });
};

export const sendEmailVerification = async (to: string, verifyToken: string): Promise<void> => {
    const verifyUrl = `${config.appUrl}/auth/verify-email?token=${verifyToken}`;
    await sendEmail({
        to,
        subject: 'Verify Your Email - Terapitika',
        html: `<h1>Email Verification</h1><p>Click <a href="${verifyUrl}">here</a> to verify your email address.</p>`,
    });
};

export const sendBookingConfirmation = async (to: string, data: { therapistName: string; date: string; time: string; mode: string }): Promise<void> => {
    await sendEmail({
        to,
        subject: 'Booking Confirmed - Terapitika',
        html: `<h1>Booking Confirmed</h1><p>Your ${data.mode} session with ${data.therapistName} is scheduled for ${data.date} at ${data.time}.</p>`,
    });
};

export const sendSessionReminder = async (to: string, data: { therapistName: string; date: string; time: string }): Promise<void> => {
    await sendEmail({
        to,
        subject: 'Session Reminder - Terapitika',
        html: `<h1>Upcoming Session</h1><p>Reminder: Your session with ${data.therapistName} is on ${data.date} at ${data.time}.</p>`,
    });
};

export const sendCrisisAlert = async (to: string, data: { userId: string; severity: string }): Promise<void> => {
    await sendEmail({
        to,
        subject: `⚠️ Crisis Alert - Severity: ${data.severity}`,
        html: `<h1>Crisis Alert</h1><p>A crisis has been detected for user ${data.userId} with severity: ${data.severity}.</p>`,
    });
};
