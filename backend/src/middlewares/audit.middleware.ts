import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { AuditLog } from '../models';
import logger from '../utils/logger';

/**
 * Audit middleware for HIPAA compliance.
 * Logs all API requests to the audit_logs table with user, action, IP, and user-agent info.
 */
export function auditMiddleware(resourceType: string, action: string) {
    return async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
        try {
            await AuditLog.create({
                user_id: req.user?.id || undefined,
                action,
                resource_type: resourceType,
                resource_id: (req.params as { id?: string }).id || undefined,
                changes: {
                    method: req.method,
                    path: req.originalUrl,
                    body: sanitizeBody(req.body),
                },
                ip_address: req.ip || req.socket.remoteAddress || 'unknown',
                user_agent: req.headers['user-agent'] || 'unknown',
            });
        } catch (error) {
            // Don't block the request if audit logging fails
            logger.error('Audit logging failed:', error);
        }
        next();
    };
}

/**
 * Remove sensitive fields before logging request body
 */
function sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') return body;
    const sanitized = { ...body };
    const sensitiveFields = ['password', 'password_hash', 'token', 'refreshToken', 'credit_card', 'ssn'];
    for (const field of sensitiveFields) {
        if (sanitized[field]) {
            sanitized[field] = '[REDACTED]';
        }
    }
    return sanitized;
}

export default auditMiddleware;
