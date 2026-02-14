import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { ICrisisLog, CrisisSeverity, CrisisType } from '../types';

interface CrisisLogCreationAttributes extends Optional<ICrisisLog,
    'id' | 'session_id' | 'message_id' | 'crisis_type' | 'content_snippet' |
    'action_taken' | 'escalated_to' | 'resolved' | 'resolved_at' |
    'resolved_by' | 'notes' | 'created_at'
> { }

class CrisisLog extends Model<ICrisisLog, CrisisLogCreationAttributes> implements ICrisisLog {
    public id!: string;
    public user_id!: string;
    public session_id?: string;
    public message_id?: string;
    public severity!: CrisisSeverity;
    public crisis_type?: CrisisType;
    public detected_by!: string;
    public content_snippet?: string;
    public action_taken?: string;
    public escalated_to?: string;
    public resolved!: boolean;
    public resolved_at?: Date;
    public resolved_by?: string;
    public notes?: string;
    public readonly created_at!: Date;

    public isResolved(): boolean { return this.resolved; }
    public isCritical(): boolean { return this.severity === CrisisSeverity.CRITICAL; }

    public async resolve(resolvedBy: string, notes?: string): Promise<void> {
        this.resolved = true;
        this.resolved_at = new Date();
        this.resolved_by = resolvedBy;
        if (notes) this.notes = notes;
        await this.save();
    }
}

CrisisLog.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        user_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
        session_id: { type: DataTypes.UUID, allowNull: true, references: { model: 'therapy_sessions', key: 'id' } },
        message_id: { type: DataTypes.UUID, allowNull: true, references: { model: 'messages', key: 'id' } },
        severity: { type: DataTypes.ENUM(...Object.values(CrisisSeverity)), allowNull: false },
        crisis_type: { type: DataTypes.STRING(50), allowNull: true },
        detected_by: { type: DataTypes.STRING(20), allowNull: false },
        content_snippet: { type: DataTypes.TEXT, allowNull: true, comment: 'Encrypted snippet that triggered flag' },
        action_taken: { type: DataTypes.TEXT, allowNull: true },
        escalated_to: { type: DataTypes.STRING(50), allowNull: true },
        resolved: { type: DataTypes.BOOLEAN, defaultValue: false },
        resolved_at: { type: DataTypes.DATE, allowNull: true },
        resolved_by: { type: DataTypes.UUID, allowNull: true, references: { model: 'users', key: 'id' } },
        notes: { type: DataTypes.TEXT, allowNull: true },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
        sequelize, tableName: 'crisis_logs', timestamps: false, underscored: true,
        indexes: [
            { fields: ['user_id'] },
            { fields: ['severity'] },
            { fields: ['resolved'] },
            { fields: ['created_at'] },
        ],
    }
);

export default CrisisLog;
