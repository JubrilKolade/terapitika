import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { IMessage, SenderType, ContentType } from '../types';
import { encrypt, decrypt } from '../utils/encryption';
import Session from './session.model';
import User from './user.model';

interface MessageCreationAttributes extends Optional<IMessage,
  'id' | 'sender_id' | 'file_url' | 'sentiment_score' | 'crisis_severity' |
  'is_edited' | 'edited_at' | 'read_at' | 'created_at'
> { }

class Message extends Model<IMessage, MessageCreationAttributes> implements IMessage {
  public id!: string;
  public session_id!: string;
  public sender_id?: string;
  public sender_type!: SenderType;
  public content!: string;
  public content_type!: ContentType;
  public file_url?: string;
  public sentiment_score?: number;
  public crisis_detected!: boolean;
  public crisis_severity?: string;
  public ai_flagged!: boolean;
  public is_edited!: boolean;
  public edited_at?: Date;
  public read_at?: Date;
  public readonly created_at!: Date;

  // Associated models
  public readonly session?: Session;
  public readonly sender?: User;

  // Check if message is from AI
  public isFromAI(): boolean {
    return this.sender_type === SenderType.AI;
  }

  // Check if message is from therapist
  public isFromTherapist(): boolean {
    return this.sender_type === SenderType.THERAPIST;
  }

  // Check if message is from client
  public isFromClient(): boolean {
    return this.sender_type === SenderType.CLIENT;
  }

  // Check if message has been read
  public isRead(): boolean {
    return !!this.read_at;
  }

  // Mark as read
  public async markAsRead(): Promise<void> {
    if (!this.read_at) {
      this.read_at = new Date();
      await this.save();
    }
  }

  // Edit message
  public async edit(newContent: string): Promise<void> {
    this.content = newContent;
    this.is_edited = true;
    this.edited_at = new Date();
    await this.save();
  }

  // Get decrypted content (if encrypted)
  public getDecryptedContent(): string {
    try {
      // Check if content is encrypted (has encrypted format)
      if (this.content.includes(':')) {
        return decrypt(this.content);
      }
      return this.content;
    } catch {
      return this.content;
    }
  }

  // Check if message contains crisis indicators
  public hasCrisisIndicators(): boolean {
    return this.crisis_detected || this.ai_flagged;
  }
}

Message.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    session_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'therapy_sessions',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    sender_type: {
      type: DataTypes.ENUM(...Object.values(SenderType)),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'May be encrypted for sensitive conversations',
    },
    content_type: {
      type: DataTypes.ENUM(...Object.values(ContentType)),
      allowNull: false,
      defaultValue: ContentType.TEXT,
    },
    file_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sentiment_score: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      comment: 'Range from -1 to 1',
    },
    crisis_detected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    crisis_severity: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    ai_flagged: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_edited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    edited_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'messages',
    timestamps: false, // Using created_at manually
    underscored: true,
    indexes: [
      {
        fields: ['session_id'],
      },
      {
        fields: ['sender_id'],
      },
      {
        fields: ['crisis_detected'],
      },
      {
        fields: ['created_at'],
      },
    ],
    hooks: {
      // Optionally encrypt sensitive messages before saving
      beforeCreate: async (message: Message) => {
        // Only encrypt messages from clients in human therapist sessions
        // (AI sessions are already analyzed, so we keep them readable)
        if (message.sender_type === SenderType.CLIENT && message.content) {
          // You can enable encryption here if needed
          // message.content = encrypt(message.content);
        }
      },
    },
  }
);

// Define associations
Message.belongsTo(Session, {
  foreignKey: 'session_id',
  as: 'session',
});

Message.belongsTo(User, {
  foreignKey: 'sender_id',
  as: 'sender',
});

Session.hasMany(Message, {
  foreignKey: 'session_id',
  as: 'messages',
});

export default Message;