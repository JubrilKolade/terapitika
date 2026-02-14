import config from '../config/environment';
import logger from '../utils/logger';
import { generateToken } from '../utils/encryption';
import path from 'path';

interface UploadResult {
    url: string;
    key: string;
    bucket: string;
}

let s3: any = null;
let bucketCache: string | null = null;

const getS3 = () => {
    if (!s3) {
        const AWS = require('aws-sdk');
        const isMinIO = config.storage.provider === 'minio';
        bucketCache = isMinIO ? config.storage.minio.bucket : config.storage.aws.bucket || 'terapitika';

        s3 = new AWS.S3({
            accessKeyId: isMinIO ? config.storage.minio.accessKey : config.storage.aws.accessKeyId,
            secretAccessKey: isMinIO ? config.storage.minio.secretKey : config.storage.aws.secretAccessKey,
            endpoint: isMinIO ? `http://${config.storage.minio.endpoint}:${config.storage.minio.port}` : undefined,
            s3ForcePathStyle: isMinIO,
            signatureVersion: 'v4',
            region: config.storage.aws.region || 'us-east-1',
        });
    }
    return { s3, bucket: bucketCache! };
};

export const getSignedUrl = async (key: string, expiresIn = 3600): Promise<string> => {
    const { s3, bucket } = getS3();
    return s3.getSignedUrl('getObject', {
        Bucket: bucket,
        Key: key,
        Expires: expiresIn,
    });
};

export const upload = async (file: Buffer, originalName: string, folder: string, mimeType?: string): Promise<UploadResult> => {
    const ext = path.extname(originalName);
    const key = `${folder}/${generateToken(16)}${ext}`;
    const { s3, bucket } = getS3();

    const params = {
        Bucket: bucket,
        Key: key,
        Body: file,
        ContentType: mimeType || 'application/octet-stream',
    };

    try {
        await s3.putObject(params).promise();
        const url = await getSignedUrl(key);
        logger.info(`File uploaded: ${key}`);
        return { url, key, bucket };
    } catch (error) {
        logger.error('File upload failed:', error);
        throw error;
    }
};

export const deleteFile = async (key: string): Promise<void> => {
    const { s3, bucket } = getS3();
    try {
        await s3.deleteObject({ Bucket: bucket, Key: key }).promise();
        logger.info(`File deleted: ${key}`);
    } catch (error) {
        logger.error('File deletion failed:', error);
        throw error;
    }
};

export const uploadProfilePicture = async (userId: string, file: Buffer, originalName: string): Promise<string> => {
    const result = await upload(file, originalName, `users/${userId}/profile-pictures`);
    return result.url;
};

export const uploadVerificationDoc = async (therapistId: string, file: Buffer, originalName: string): Promise<string> => {
    const result = await upload(file, originalName, `therapists/${therapistId}/license-documents`);
    return result.url;
};

export const uploadSessionAttachment = async (sessionId: string, file: Buffer, originalName: string): Promise<string> => {
    const result = await upload(file, originalName, `sessions/${sessionId}/attachments`);
    return result.url;
};

export const uploadSupportAttachment = async (ticketId: string, file: Buffer, originalName: string): Promise<string> => {
    const result = await upload(file, originalName, `support/${ticketId}`);
    return result.url;
};
