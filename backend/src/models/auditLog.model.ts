import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface IAuditLog {
    id: string;
    user_id?: string;
    action: string;
    resource_type?: string;
    resource_id?: string;
    ip_address?: string;
    user_agent?: string;
    changes?: any;
    status?: string;
    error_message?: string;
    created_at: Date;
}

interface AuditLogCreationAttributes extends Optional<IAuditLog,
    'id' | 'user_id' | 'resource_type' | 'resource_id' | 'ip_address' |
    'user_agent' | 'changes' | 'status' | 'error_message' | 'created_at'
> { }

class AuditLog extends Model<IAuditLog, AuditLogCreationAttributes> implements IAuditLog {
    public id!: string;
    public user_id?: string;
    public action!: string;
    public resource_type?: string;
    public resource_id?: string;
    public ip_address?: string;
    public user_agent?: string;
    public changes?: any;
    public status?: string;
    public error_message?: string;
    public readonly created_at!: Date;

    /**
     * Create an audit log entry
     */
    public static async log(data: {
        userId?: string;
        action: string;
        resourceType?: string;
        resourceId?: string;
        ipAddress?: string;
        userAgent?: string;
        changes?: any;
        status?: string;
        errorMessage?: string;
    }): Promise<AuditLog> {
        return this.create({
            user_id: data.userId,
            action: data.action,
            resource_type: data.resourceType,
            resource_id: data.resourceId,
            ip_address: data.ipAddress,
            user_agent: data.userAgent,
            changes: data.changes,
            status: data.status || 'success',
            error_message: data.errorMessage,
        });
    }
}

AuditLog.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        user_id: { type: DataTypes.UUID, allowNull: true, references: { model: 'users', key: 'id' } },
        action: { type: DataTypes.STRING(100), allowNull: false },
        resource_type: { type: DataTypes.STRING(50), allowNull: true },
        resource_id: { type: DataTypes.UUID, allowNull: true },
        ip_address: { type: DataTypes.INET, allowNull: true },
        user_agent: { type: DataTypes.TEXT, allowNull: true },
        changes: { type: DataTypes.JSONB, allowNull: true },
        status: { type: DataTypes.STRING(20), allowNull: true },
        error_message: { type: DataTypes.TEXT, allowNull: true },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
        sequelize, tableName: 'audit_logs', timestamps: false, underscored: true,
        indexes: [
            { fields: ['user_id'] },
            { fields: ['action'] },
            { fields: ['created_at'] },
        ],
    }
);

export default AuditLog;
