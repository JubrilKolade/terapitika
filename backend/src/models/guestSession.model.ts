import { DataTypes, Model, Optional, Op } from 'sequelize';
import sequelize from '../config/database';
import { IGuestSession } from '../types';
import { generateToken } from '../utils/encryption';

interface GuestSessionCreationAttributes extends Optional<IGuestSession,
  'id' | 'session_token' | 'ip_address' | 'user_agent' | 'created_at'
> { }

class GuestSession extends Model<IGuestSession, GuestSessionCreationAttributes> implements IGuestSession {
  public id!: string;
  public session_token!: string;
  public ip_address?: string;
  public user_agent?: string;
  public message_count!: number;
  public max_messages!: number;
  public expires_at!: Date;
  public readonly created_at!: Date;

  // Check if session is expired
  public isExpired(): boolean {
    return new Date() > this.expires_at;
  }

  // Check if message limit reached
  public hasReachedLimit(): boolean {
    return this.message_count >= this.max_messages;
  }

  // Check if can send message
  public canSendMessage(): boolean {
    return !this.isExpired() && !this.hasReachedLimit();
  }

  // Increment message count
  public async incrementMessageCount(): Promise<void> {
    this.message_count += 1;
    await this.save();
  }

  // Get remaining messages
  public getRemainingMessages(): number {
    return Math.max(0, this.max_messages - this.message_count);
  }

  // Extend session expiration
  public async extend(hours: number = 1): Promise<void> {
    const newExpiry = new Date();
    newExpiry.setHours(newExpiry.getHours() + hours);
    this.expires_at = newExpiry;
    await this.save();
  }

  // Create new guest session
  public static async createGuestSession(
    maxMessages: number = 10,
    expiryHours: number = 1,
    ipAddress?: string,
    userAgent?: string
  ): Promise<GuestSession> {
    const sessionToken = generateToken(32);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiryHours);

    return this.create({
      session_token: sessionToken,
      ip_address: ipAddress,
      user_agent: userAgent,
      message_count: 0,
      max_messages: maxMessages,
      expires_at: expiresAt,
    });
  }

  // Find valid session by token
  public static async findValidSession(token: string): Promise<GuestSession | null> {
    const session = await this.findOne({
      where: { session_token: token },
    });

    if (!session || session.isExpired()) {
      return null;
    }

    return session;
  }

  // Clean up expired sessions
  public static async cleanupExpiredSessions(): Promise<number> {
    const result = await this.destroy({
      where: {
        expires_at: {
          [Op.lt]: new Date(),
        },
      },
    });

    return result;
  }
}

GuestSession.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    session_token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    ip_address: {
      type: DataTypes.INET,
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    message_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    max_messages: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'guest_sessions',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['session_token'],
      },
      {
        fields: ['expires_at'],
      },
    ],
  }
);

export default GuestSession;