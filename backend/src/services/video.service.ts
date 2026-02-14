import config from '../config/environment';
import logger from '../utils/logger';

interface VideoRoom {
    sid: string;
    name: string;
    status: string;
    maxParticipants: number;
}

interface VideoToken {
    token: string;
    roomName: string;
    identity: string;
}

let client: any = null;

const getClient = () => {
    if (!client && config.twilio?.accountSid && config.twilio?.authToken) {
        const twilio = require('twilio');
        client = twilio(config.twilio.accountSid, config.twilio.authToken);
    }
    return client;
};

export const createRoom = async (sessionId: string, maxParticipants = 2): Promise<VideoRoom> => {
    const twilioClient = getClient();
    if (!twilioClient) throw new Error('Video service not configured');

    try {
        const room = await twilioClient.video.v1.rooms.create({
            uniqueName: `session-${sessionId}`,
            type: 'group-small',
            maxParticipants,
            statusCallback: `${config.apiUrl}/api/video/webhooks/room-status`,
            recordParticipantsOnConnect: false,
        });
        logger.info(`Video room created: ${room.sid}`);
        return { sid: room.sid, name: room.uniqueName, status: room.status, maxParticipants: room.maxParticipants };
    } catch (error) {
        logger.error('Failed to create video room:', error);
        throw error;
    }
};

export const generateAccessToken = (identity: string, roomName: string): VideoToken => {
    if (!config.twilio?.apiKey || !config.twilio?.apiSecret) {
        throw new Error('Twilio API keys not configured');
    }
    const twilio = require('twilio');
    const AccessToken = twilio.jwt.AccessToken;
    const VideoGrant = AccessToken.VideoGrant;

    const token = new AccessToken(
        config.twilio.accountSid!,
        config.twilio.apiKey,
        config.twilio.apiSecret,
        { identity }
    );

    const videoGrant = new VideoGrant({ room: roomName });
    token.addGrant(videoGrant);

    return { token: token.toJwt(), roomName, identity };
};

export const endRoom = async (roomSid: string): Promise<void> => {
    const twilioClient = getClient();
    if (!twilioClient) throw new Error('Video service not configured');
    try {
        await twilioClient.video.v1.rooms(roomSid).update({ status: 'completed' });
        logger.info(`Video room ended: ${roomSid}`);
    } catch (error) {
        logger.error('Failed to end video room:', error);
        throw error;
    }
};

export const getRoomParticipants = async (roomSid: string): Promise<any[]> => {
    const twilioClient = getClient();
    if (!twilioClient) throw new Error('Video service not configured');
    const participants = await twilioClient.video.v1.rooms(roomSid).participants.list();
    return participants.map((p: any) => ({
        sid: p.sid,
        identity: p.identity,
        status: p.status,
        duration: p.duration,
    }));
};

export const initiateVoiceCall = async (from: string, to: string, sessionId: string): Promise<any> => {
    const twilioClient = getClient();
    if (!twilioClient) throw new Error('Voice service not configured');
    const call = await twilioClient.calls.create({
        url: `${config.apiUrl}/api/voice/twiml/${sessionId}`,
        to,
        from: config.twilio?.phoneNumber || from,
    });
    logger.info(`Voice call initiated: ${call.sid}`);
    return { callSid: call.sid, status: call.status };
};
