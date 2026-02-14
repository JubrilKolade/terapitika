import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ISupportMessage {
    id: string;
    ticket_id: string;
    sender_id?: string;
    message: string;
    attachments?: any[];
    is_internal: boolean;
    created_at: Date;
}

interface SupportMessageCreationAttributes extends Optional<ISupportMessage,
    'id' | 'sender_id' | 'attachments' | 'is_internal' | 'created_at'
> { }

class SupportMessage extends Model<ISupportMessage, SupportMessageCreationAttributes> implements ISupportMessage {
    public id!: string;
    public ticket_id!: string;
    public sender_id?: string;
    public message!: string;
    public attachments?: any[];
    public is_internal!: boolean;
    public readonly created_at!: Date;
}

SupportMessage.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        ticket_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'support_tickets', key: 'id' }, onDelete: 'CASCADE' },
        sender_id: { type: DataTypes.UUID, allowNull: true, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
        message: { type: DataTypes.TEXT, allowNull: false },
        attachments: { type: DataTypes.JSONB, allowNull: true },
        is_internal: { type: DataTypes.BOOLEAN, defaultValue: false },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
        sequelize, tableName: 'support_messages', timestamps: false, underscored: true,
        indexes: [
            { fields: ['ticket_id'] },
        ],
    }
);

export default SupportMessage;
