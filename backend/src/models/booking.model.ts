import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { IBooking, BookingStatus, CommunicationMode } from '../types';

interface BookingCreationAttributes extends Optional<IBooking,
    'id' | 'session_id' | 'notes' | 'reminder_sent' | 'calendly_event_id' |
    'zoom_meeting_id' | 'twilio_room_sid' | 'created_at' | 'updated_at'
> { }

class Booking extends Model<IBooking, BookingCreationAttributes> implements IBooking {
    public id!: string;
    public client_id!: string;
    public therapist_id!: string;
    public session_id?: string;
    public scheduled_at!: Date;
    public duration_minutes!: number;
    public booking_status!: BookingStatus;
    public communication_mode!: CommunicationMode;
    public notes?: string;
    public reminder_sent!: boolean;
    public calendly_event_id?: string;
    public zoom_meeting_id?: string;
    public twilio_room_sid?: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    public isPending(): boolean { return this.booking_status === BookingStatus.PENDING; }
    public isConfirmed(): boolean { return this.booking_status === BookingStatus.CONFIRMED; }
    public isCancelled(): boolean { return this.booking_status === BookingStatus.CANCELLED; }

    public async confirm(): Promise<void> {
        this.booking_status = BookingStatus.CONFIRMED;
        await this.save();
    }

    public async cancel(): Promise<void> {
        this.booking_status = BookingStatus.CANCELLED;
        await this.save();
    }
}

Booking.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        client_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
        therapist_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'therapists', key: 'id' }, onDelete: 'CASCADE' },
        session_id: { type: DataTypes.UUID, allowNull: true, unique: true, references: { model: 'therapy_sessions', key: 'id' } },
        scheduled_at: { type: DataTypes.DATE, allowNull: false },
        duration_minutes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 60 },
        booking_status: { type: DataTypes.ENUM(...Object.values(BookingStatus)), allowNull: false, defaultValue: BookingStatus.PENDING },
        communication_mode: { type: DataTypes.ENUM(...Object.values(CommunicationMode)), allowNull: true },
        notes: { type: DataTypes.TEXT, allowNull: true },
        reminder_sent: { type: DataTypes.BOOLEAN, defaultValue: false },
        calendly_event_id: { type: DataTypes.STRING(255), allowNull: true },
        zoom_meeting_id: { type: DataTypes.STRING(255), allowNull: true },
        twilio_room_sid: { type: DataTypes.STRING(255), allowNull: true },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
        sequelize, tableName: 'bookings', timestamps: true, underscored: true,
        indexes: [
            { fields: ['client_id'] },
            { fields: ['therapist_id'] },
            { fields: ['scheduled_at'] },
            { fields: ['booking_status'] },
        ],
    }
);

export default Booking;
