import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { ISupportTicket, TicketStatus } from '../types';

interface SupportTicketCreationAttributes extends Optional<ISupportTicket,
    'id' | 'category' | 'assigned_to' | 'resolution_notes' |
    'resolved_at' | 'created_at' | 'updated_at'
> { }

class SupportTicket extends Model<ISupportTicket, SupportTicketCreationAttributes> implements ISupportTicket {
    public id!: string;
    public user_id!: string;
    public subject!: string;
    public description!: string;
    public category?: string;
    public priority!: string;
    public status!: TicketStatus;
    public assigned_to?: string;
    public resolution_notes?: string;
    public resolved_at?: Date;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    public isOpen(): boolean { return this.status === TicketStatus.OPEN; }
    public isResolved(): boolean { return this.status === TicketStatus.RESOLVED; }

    public async resolve(notes: string): Promise<void> {
        this.status = TicketStatus.RESOLVED;
        this.resolution_notes = notes;
        this.resolved_at = new Date();
        await this.save();
    }

    public async close(): Promise<void> {
        this.status = TicketStatus.CLOSED;
        await this.save();
    }
}

SupportTicket.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        user_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
        subject: { type: DataTypes.STRING(255), allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: false },
        category: { type: DataTypes.STRING(50), allowNull: true },
        priority: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'medium' },
        status: { type: DataTypes.ENUM(...Object.values(TicketStatus)), allowNull: false, defaultValue: TicketStatus.OPEN },
        assigned_to: { type: DataTypes.UUID, allowNull: true, references: { model: 'users', key: 'id' } },
        resolution_notes: { type: DataTypes.TEXT, allowNull: true },
        resolved_at: { type: DataTypes.DATE, allowNull: true },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
        sequelize, tableName: 'support_tickets', timestamps: true, underscored: true,
        indexes: [
            { fields: ['user_id'] },
            { fields: ['status'] },
            { fields: ['assigned_to'] },
        ],
    }
);

export default SupportTicket;
