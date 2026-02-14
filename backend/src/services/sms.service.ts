import config from '../config/environment';
import logger from '../utils/logger';

let client: any = null;

const getClient = () => {
    if (!client && config.twilio?.accountSid && config.twilio?.authToken) {
        const twilio = require('twilio');
        client = twilio(config.twilio.accountSid, config.twilio.authToken);
    }
    return client;
};

export const sendSMS = async (to: string, body: string): Promise<void> => {
    const twilioClient = getClient();
    if (!twilioClient) {
        logger.warn('Twilio not configured, skipping SMS');
        return;
    }
    try {
        await twilioClient.messages.create({
            body,
            from: config.twilio?.phoneNumber,
            to,
        });
        logger.info(`SMS sent to ${to}`);
    } catch (error) {
        logger.error(`Failed to send SMS to ${to}:`, error);
        throw error;
    }
};

export const sendSessionReminder = async (to: string, therapistName: string, dateTime: string): Promise<void> => {
    await sendSMS(to, `Terapitika: Reminder - Your session with ${therapistName} is on ${dateTime}. Reply HELP for support.`);
};

export const sendBookingConfirmation = async (to: string, therapistName: string, dateTime: string): Promise<void> => {
    await sendSMS(to, `Terapitika: Your session with ${therapistName} on ${dateTime} has been confirmed.`);
};

export const sendVerificationCode = async (to: string, code: string): Promise<void> => {
    await sendSMS(to, `Terapitika: Your verification code is ${code}. It expires in 10 minutes.`);
};

export const sendCrisisResponse = async (to: string): Promise<void> => {
    await sendSMS(to, `If you or someone you know is in crisis, please call the 988 Suicide & Crisis Lifeline by dialing 988.`);
};
