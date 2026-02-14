import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { INotification } from '../types';

interface NotificationCreationAttributes extends Optional<INotification,
    'id' | 'action_url' | 'is_read' | 'read_at' | 'sent_via' | 'created_at'
> { }

class Notification extends Model<INotification, NotificationCreationAttributes> implements INotification {
    public id!: string;
    public user_id!: string;
    public type!: string;
    public title!: string;
    public message!: string;
    public action_url?: string;
    public is_read!: boolean;
    public read_at?: Date;
    public sent_via?: any;
    public readonly created_at!: Date;

    public async markAsRead(): Promise<void> {
        if (!this.is_read) {
            this.is_read = true;
            this.read_at = new Date();
            await this.save();
        }
    }
}

Notification.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        user_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
        type: { type: DataTypes.STRING(50), allowNull: false },
        title: { type: DataTypes.STRING(255), allowNull: false },
        message: { type: DataTypes.TEXT, allowNull: false },
        action_url: { type: DataTypes.TEXT, allowNull: true },
        is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
        read_at: { type: DataTypes.DATE, allowNull: true },
        sent_via: { type: DataTypes.JSONB, allowNull: true },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
        sequelize, tableName: 'notifications', timestamps: false, underscored: true,
        indexes: [
            { fields: ['user_id'] },
            { fields: ['is_read'] },
            { fields: ['created_at'] },
        ],
    }
);

export default Notification;
