import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { IPayment, PaymentStatus } from '../types';

interface PaymentCreationAttributes extends Optional<IPayment,
    'id' | 'therapist_id' | 'session_id' | 'stripe_payment_intent_id' |
    'stripe_charge_id' | 'failure_reason' | 'refund_amount' | 'refunded_at' |
    'metadata' | 'created_at' | 'updated_at'
> { }

class Payment extends Model<IPayment, PaymentCreationAttributes> implements IPayment {
    public id!: string;
    public user_id!: string;
    public therapist_id?: string;
    public session_id?: string;
    public amount!: number;
    public currency!: string;
    public payment_method!: string;
    public stripe_payment_intent_id?: string;
    public stripe_charge_id?: string;
    public status!: PaymentStatus;
    public failure_reason?: string;
    public refund_amount?: number;
    public refunded_at?: Date;
    public metadata?: any;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    public isPending(): boolean { return this.status === PaymentStatus.PENDING; }
    public isSucceeded(): boolean { return this.status === PaymentStatus.SUCCEEDED; }
    public isRefunded(): boolean { return this.status === PaymentStatus.REFUNDED; }
}

Payment.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        user_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
        therapist_id: { type: DataTypes.UUID, allowNull: true, references: { model: 'therapists', key: 'id' } },
        session_id: { type: DataTypes.UUID, allowNull: true, references: { model: 'therapy_sessions', key: 'id' } },
        amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        currency: { type: DataTypes.STRING(3), defaultValue: 'USD' },
        payment_method: { type: DataTypes.STRING(50), allowNull: true },
        stripe_payment_intent_id: { type: DataTypes.STRING(255), allowNull: true },
        stripe_charge_id: { type: DataTypes.STRING(255), allowNull: true },
        status: { type: DataTypes.ENUM(...Object.values(PaymentStatus)), allowNull: false, defaultValue: PaymentStatus.PENDING },
        failure_reason: { type: DataTypes.TEXT, allowNull: true },
        refund_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
        refunded_at: { type: DataTypes.DATE, allowNull: true },
        metadata: { type: DataTypes.JSONB, allowNull: true },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
        sequelize, tableName: 'payments', timestamps: true, underscored: true,
        indexes: [
            { fields: ['user_id'] },
            { fields: ['therapist_id'] },
            { fields: ['session_id'] },
            { fields: ['status'] },
        ],
    }
);

export default Payment;
