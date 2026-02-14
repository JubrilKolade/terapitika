import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { IUser, UserRole, AuthProvider } from '../types';
import { hashPassword } from '../utils/encryption';

// User creation attributes (optional fields)
interface UserCreationAttributes extends Optional<IUser, 
  'id' | 'profile_picture_url' | 'phone' | 'date_of_birth' | 'gender' | 
  'is_verified' | 'is_active' | 'oauth_id' | 'emergency_contact' | 
  'preferences' | 'created_at' | 'updated_at' | 'last_login_at' | 'deleted_at'
> {}

// User model class
class User extends Model<IUser, UserCreationAttributes> implements IUser {
  public id!: string;
  public email!: string;
  public password_hash?: string;
  public first_name?: string;
  public last_name?: string;
  public phone?: string;
  public date_of_birth?: Date;
  public gender?: string;
  public profile_picture_url?: string;
  public role!: UserRole;
  public is_verified!: boolean;
  public is_active!: boolean;
  public auth_provider!: AuthProvider;
  public oauth_id?: string;
  public emergency_contact?: any;
  public preferences?: any;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public last_login_at?: Date;
  public deleted_at?: Date;

  // Virtual field - full name
  public get fullName(): string {
    return `${this.first_name || ''} ${this.last_name || ''}`.trim();
  }

  // Check if user has role
  public hasRole(role: UserRole): boolean {
    return this.role === role;
  }

  // Check if user is client
  public isClient(): boolean {
    return this.role === UserRole.CLIENT;
  }

  // Check if user is therapist
  public isTherapist(): boolean {
    return this.role === UserRole.THERAPIST;
  }

  // Check if user is admin
  public isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  // Update last login
  public async updateLastLogin(): Promise<void> {
    this.last_login_at = new Date();
    await this.save();
  }

  // Soft delete user
  public async softDelete(): Promise<void> {
    this.deleted_at = new Date();
    this.is_active = false;
    await this.save();
  }

  // Restore soft deleted user
  public async restore(): Promise<void> {
    this.deleted_at = undefined;
    this.is_active = true;
    await this.save();
  }

  // Remove password from JSON output
  public toJSON(): object {
    const values = { ...this.get() };
    delete values.password_hash;
    return values;
  }
}

// Define User model schema
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Must be a valid email address',
        },
      },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    profile_picture_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.CLIENT,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    auth_provider: {
      type: DataTypes.ENUM(...Object.values(AuthProvider)),
      allowNull: false,
      defaultValue: AuthProvider.LOCAL,
    },
    oauth_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    emergency_contact: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    preferences: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        language: 'en',
        timezone: 'America/New_York',
        notification_settings: {
          email: true,
          sms: false,
          push: true,
        },
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
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
    paranoid: false, // We handle soft deletes manually
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
      {
        fields: ['role'],
      },
      {
        fields: ['auth_provider', 'oauth_id'],
      },
      {
        fields: ['is_active'],
      },
    ],
    hooks: {
      // Hash password before creating user
      beforeCreate: async (user: User) => {
        if (user.password_hash) {
          user.password_hash = await hashPassword(user.password_hash);
        }
      },
      // Hash password before updating if changed
      beforeUpdate: async (user: User) => {
        if (user.changed('password_hash') && user.password_hash) {
          user.password_hash = await hashPassword(user.password_hash);
        }
      },
    },
  }
);

export default User;