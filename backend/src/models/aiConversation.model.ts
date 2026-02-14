import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface IAIConversation {
    id: string;
    user_id?: string;
    guest_session_id?: string;
    session_id?: string;
    message_count: number;
    avg_sentiment?: number;
    topics?: any;
    crisis_count: number;
    duration_minutes?: number;
    outcome?: string;
    user_satisfaction?: number;
    created_at: Date;
    ended_at?: Date;
}

interface AIConversationCreationAttributes extends Optional<IAIConversation,
    'id' | 'user_id' | 'guest_session_id' | 'session_id' | 'message_count' |
    'avg_sentiment' | 'topics' | 'crisis_count' | 'duration_minutes' |
    'outcome' | 'user_satisfaction' | 'created_at' | 'ended_at'
> { }

class AIConversation extends Model<IAIConversation, AIConversationCreationAttributes> implements IAIConversation {
    public id!: string;
    public user_id?: string;
    public guest_session_id?: string;
    public session_id?: string;
    public message_count!: number;
    public avg_sentiment?: number;
    public topics?: any;
    public crisis_count!: number;
    public duration_minutes?: number;
    public outcome?: string;
    public user_satisfaction?: number;
    public readonly created_at!: Date;
    public ended_at?: Date;
}

AIConversation.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        user_id: { type: DataTypes.UUID, allowNull: true, references: { model: 'users', key: 'id' } },
        guest_session_id: { type: DataTypes.UUID, allowNull: true, references: { model: 'guest_sessions', key: 'id' } },
        session_id: { type: DataTypes.UUID, allowNull: true, references: { model: 'therapy_sessions', key: 'id' } },
        message_count: { type: DataTypes.INTEGER, defaultValue: 0 },
        avg_sentiment: { type: DataTypes.DECIMAL(3, 2), allowNull: true },
        topics: { type: DataTypes.JSONB, allowNull: true },
        crisis_count: { type: DataTypes.INTEGER, defaultValue: 0 },
        duration_minutes: { type: DataTypes.INTEGER, allowNull: true },
        outcome: { type: DataTypes.STRING(50), allowNull: true },
        user_satisfaction: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 1, max: 5 } },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        ended_at: { type: DataTypes.DATE, allowNull: true },
    },
    {
        sequelize, tableName: 'ai_conversations', timestamps: false, underscored: true,
        indexes: [
            { fields: ['user_id'] },
            { fields: ['guest_session_id'] },
        ],
    }
);

export default AIConversation;
