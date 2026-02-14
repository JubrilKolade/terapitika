import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface IReview {
    id: string;
    client_id: string;
    therapist_id: string;
    session_id: string;
    rating: number;
    review_text?: string;
    is_anonymous: boolean;
    is_published: boolean;
    therapist_response?: string;
    responded_at?: Date;
    created_at: Date;
    updated_at: Date;
}

interface ReviewCreationAttributes extends Optional<IReview,
    'id' | 'review_text' | 'is_anonymous' | 'is_published' |
    'therapist_response' | 'responded_at' | 'created_at' | 'updated_at'
> { }

class Review extends Model<IReview, ReviewCreationAttributes> implements IReview {
    public id!: string;
    public client_id!: string;
    public therapist_id!: string;
    public session_id!: string;
    public rating!: number;
    public review_text?: string;
    public is_anonymous!: boolean;
    public is_published!: boolean;
    public therapist_response?: string;
    public responded_at?: Date;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

Review.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        client_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
        therapist_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'therapists', key: 'id' }, onDelete: 'CASCADE' },
        session_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'therapy_sessions', key: 'id' }, onDelete: 'CASCADE' },
        rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
        review_text: { type: DataTypes.TEXT, allowNull: true },
        is_anonymous: { type: DataTypes.BOOLEAN, defaultValue: false },
        is_published: { type: DataTypes.BOOLEAN, defaultValue: true },
        therapist_response: { type: DataTypes.TEXT, allowNull: true },
        responded_at: { type: DataTypes.DATE, allowNull: true },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
        sequelize, tableName: 'reviews', timestamps: true, underscored: true,
        indexes: [
            { fields: ['therapist_id'] },
            { fields: ['client_id'] },
        ],
    }
);

export default Review;
