import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { ISubscription, SubscriptionStatus } from '../types';

interface SubscriptionCreationAttributes extends Optional<ISubscription,
    'id' | 'stripe_subscription_id' | 'stripe_customer_id' |
    'current_period_start' | 'current_period_end' | 'cancel_at_period_end' |
    'cancelled_at' | 'ai_message_limit' | 'ai_messages_used' |
    'monthly_therapist_hours' | 'monthly_therapist_hours_used' |
    'created_at' | 'updated_at'
> { }

class Subscription extends Model<ISubscription, SubscriptionCreationAttributes> implements ISubscription {
    public id!: string;
    public user_id!: string;
    public plan_type!: string;
    public stripe_subscription_id?: string;
    public stripe_customer_id?: string;
    public status!: SubscriptionStatus;
    public current_period_start?: Date;
    public current_period_end?: Date;
    public cancel_at_period_end!: boolean;
    public cancelled_at?: Date;
    public ai_message_limit?: number;
    public ai_messages_used!: number;
    public monthly_therapist_hours?: number;
    public monthly_therapist_hours_used!: number;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    public isActive(): boolean { return this.status === SubscriptionStatus.ACTIVE; }
    public hasAIMessagesRemaining(): boolean {
        if (!this.ai_message_limit) return true; // unlimited
        return this.ai_messages_used < this.ai_message_limit;
    }
}

Subscription.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        user_id: { type: DataTypes.UUID, allowNull: false, unique: true, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
        plan_type: { type: DataTypes.STRING(50), allowNull: false },
        stripe_subscription_id: { type: DataTypes.STRING(255), allowNull: true },
        stripe_customer_id: { type: DataTypes.STRING(255), allowNull: true },
        status: { type: DataTypes.ENUM(...Object.values(SubscriptionStatus)), allowNull: false, defaultValue: SubscriptionStatus.ACTIVE },
        current_period_start: { type: DataTypes.DATE, allowNull: true },
        current_period_end: { type: DataTypes.DATE, allowNull: true },
        cancel_at_period_end: { type: DataTypes.BOOLEAN, defaultValue: false },
        cancelled_at: { type: DataTypes.DATE, allowNull: true },
        ai_message_limit: { type: DataTypes.INTEGER, allowNull: true },
        ai_messages_used: { type: DataTypes.INTEGER, defaultValue: 0 },
        monthly_therapist_hours: { type: DataTypes.INTEGER, allowNull: true },
        monthly_therapist_hours_used: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
        sequelize, tableName: 'subscriptions', timestamps: true, underscored: true,
        indexes: [
            { unique: true, fields: ['user_id'] },
            { fields: ['status'] },
        ],
    }
);

export default Subscription;
