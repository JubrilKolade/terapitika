import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { ISession, SessionType, CommunicationMode, SessionStatus } from '../types';
import User from './user.model';
import Therapist from './therapist.model';

interface SessionCreationAttributes extends Optional<ISession,
  'id' | 'therapist_id' | 'communication_mode' | 'scheduled_at' |
  'started_at' | 'ended_at' | 'duration_minutes' | 'session_notes' |
  'ai_summary' | 'crisis_flags' | 'recording_url' | 'transcript_url' |
  'payment_status' | 'payment_amount' | 'cancellation_reason' |
  'cancelled_by' | 'created_at' | 'updated_at'
> { }

class Session extends Model<ISession, SessionCreationAttributes> implements ISession {
  public id!: string;
  public client_id!: string;
  public therapist_id?: string;
  public session_type!: SessionType;
  public communication_mode?: CommunicationMode;
  public scheduled_at?: Date;
  public started_at?: Date;
  public ended_at?: Date;
  public duration_minutes?: number;
  public status!: SessionStatus;
  public session_notes?: string;
  public ai_summary?: string;
  public crisis_flags?: any[];
  public recording_url?: string;
  public transcript_url?: string;
  public payment_status?: string;
  public payment_amount?: number;
  public cancellation_reason?: string;
  public cancelled_by?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Associated models
  public readonly client?: User;
  public readonly therapist?: Therapist;

  // Check if session is AI-only
  public isAISession(): boolean {
    return this.session_type === SessionType.AI_ONLY;
  }

  // Check if session is with human therapist
  public isHumanSession(): boolean {
    return this.session_type === SessionType.HUMAN_THERAPIST;
  }

  // Check if session is active
  public isActive(): boolean {
    return this.status === SessionStatus.IN_PROGRESS;
  }

  // Check if session is completed
  public isCompleted(): boolean {
    return this.status === SessionStatus.COMPLETED;
  }

  // Check if session has crisis flags
  public hasCrisisFlags(): boolean {
    return !!(this.crisis_flags && this.crisis_flags.length > 0);
  }

  // Start session
  public async start(): Promise<void> {
    this.status = SessionStatus.IN_PROGRESS;
    this.started_at = new Date();
    await this.save();
  }

  // End session
  public async end(): Promise<void> {
    this.status = SessionStatus.COMPLETED;
    this.ended_at = new Date();

    if (this.started_at) {
      const durationMs = this.ended_at.getTime() - this.started_at.getTime();
      this.duration_minutes = Math.round(durationMs / 60000);
    }

    await this.save();
  }

  // Cancel session
  public async cancel(reason: string, cancelledBy: string): Promise<void> {
    this.status = SessionStatus.CANCELLED;
    this.cancellation_reason = reason;
    this.cancelled_by = cancelledBy;
    await this.save();
  }

  // Add crisis flag
  public async addCrisisFlag(severity: string, content: string): Promise<void> {
    if (!this.crisis_flags) {
      this.crisis_flags = [];
    }

    this.crisis_flags.push({
      timestamp: new Date(),
      severity,
      content,
    });

    await this.save();
  }

  // Calculate cost
  public calculateCost(hourlyRate: number): number {
    if (!this.duration_minutes) return 0;
    return (hourlyRate / 60) * this.duration_minutes;
  }
}

Session.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    client_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    therapist_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'therapists',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    session_type: {
      type: DataTypes.ENUM(...Object.values(SessionType)),
      allowNull: false,
    },
    communication_mode: {
      type: DataTypes.ENUM(...Object.values(CommunicationMode)),
      allowNull: true,
    },
    scheduled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ended_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    duration_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(SessionStatus)),
      allowNull: false,
      defaultValue: SessionStatus.SCHEDULED,
    },
    session_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Encrypted therapist notes',
    },
    ai_summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    crisis_flags: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    recording_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    transcript_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    payment_status: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    payment_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    cancellation_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cancelled_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
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
    tableName: 'therapy_sessions',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['client_id'],
      },
      {
        fields: ['therapist_id'],
      },
      {
        fields: ['scheduled_at'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['session_type'],
      },
    ],
  }
);

// Define associations
Session.belongsTo(User, {
  foreignKey: 'client_id',
  as: 'client',
});

Session.belongsTo(Therapist, {
  foreignKey: 'therapist_id',
  as: 'therapist',
});

User.hasMany(Session, {
  foreignKey: 'client_id',
  as: 'sessions',
});

Therapist.hasMany(Session, {
  foreignKey: 'therapist_id',
  as: 'sessions',
});

export default Session;