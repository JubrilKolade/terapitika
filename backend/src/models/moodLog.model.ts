import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface IMoodLog {
    id: string;
    user_id: string;
    mood: number; // 1-10
    energy_level?: number; // 1-10
    anxiety_level?: number; // 1-10
    notes?: string;
    logged_at: Date;
    created_at?: Date;
    updated_at?: Date;
}

interface MoodLogCreationAttributes extends Optional<IMoodLog, 'id' | 'energy_level' | 'anxiety_level' | 'notes' | 'created_at' | 'updated_at'> { }

class MoodLog extends Model<IMoodLog, MoodLogCreationAttributes> implements IMoodLog {
    public id!: string;
    public user_id!: string;
    public mood!: number;
    public energy_level?: number;
    public anxiety_level?: number;
    public notes?: string;
    public logged_at!: Date;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

MoodLog.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        mood: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 10,
            },
        },
        energy_level: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 10,
            },
        },
        anxiety_level: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 10,
            },
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        logged_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'mood_logs',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                fields: ['user_id'],
            },
            {
                fields: ['logged_at'],
            },
        ],
    }
);

export default MoodLog;
