import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { ITherapist, LicenseVerificationStatus } from '../types';
import User from './user.model';

// Therapist creation attributes
interface TherapistCreationAttributes extends Optional<ITherapist,
  'id' | 'bio' | 'years_of_experience' | 'education' | 'certifications' |
  'hourly_rate' | 'insurance_providers' | 'availability_schedule' |
  'verification_documents' | 'stripe_account_id' | 'created_at' | 'updated_at'
> {}

class Therapist extends Model<ITherapist, TherapistCreationAttributes> implements ITherapist {
  public id!: string;
  public user_id!: string;
  public license_number!: string;
  public license_state!: string;
  public license_expiry!: Date;
  public license_verification_status!: LicenseVerificationStatus;
  public specializations!: string[];
  public bio?: string;
  public years_of_experience?: number;
  public education?: any[];
  public certifications?: any[];
  public languages!: string[];
  public hourly_rate?: number;
  public accepts_insurance!: boolean;
  public insurance_providers?: string[];
  public availability_schedule?: any;
  public video_enabled!: boolean;
  public voice_enabled!: boolean;
  public chat_enabled!: boolean;
  public rating_average!: number;
  public rating_count!: number;
  public total_sessions!: number;
  public is_accepting_clients!: boolean;
  public verification_documents?: any[];
  public stripe_account_id?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Associated user
  public readonly user?: User;

  // Check if therapist is verified
  public isVerified(): boolean {
    return this.license_verification_status === LicenseVerificationStatus.VERIFIED;
  }

  // Check if therapist is pending verification
  public isPending(): boolean {
    return this.license_verification_status === LicenseVerificationStatus.PENDING;
  }

  // Check if license is expired
  public isLicenseExpired(): boolean {
    return new Date(this.license_expiry) < new Date();
  }

  // Check if therapist can accept new clients
  public canAcceptClients(): boolean {
    return this.is_accepting_clients && this.isVerified() && !this.isLicenseExpired();
  }

  // Update rating
  public async updateRating(newRating: number): Promise<void> {
    const totalRatings = this.rating_count * this.rating_average;
    this.rating_count += 1;
    this.rating_average = (totalRatings + newRating) / this.rating_count;
    await this.save();
  }

  // Increment session count
  public async incrementSessionCount(): Promise<void> {
    this.total_sessions += 1;
    await this.save();
  }

  // Get average session rate
  public getAverageSessionRate(sessionMinutes: number = 60): number {
    if (!this.hourly_rate) return 0;
    return (this.hourly_rate / 60) * sessionMinutes;
  }
}

Therapist.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    license_number: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    license_state: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    license_expiry: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    license_verification_status: {
      type: DataTypes.ENUM(...Object.values(LicenseVerificationStatus)),
      allowNull: false,
      defaultValue: LicenseVerificationStatus.PENDING,
    },
    specializations: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
      defaultValue: [],
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    years_of_experience: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    education: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    certifications: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    languages: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
      defaultValue: ['English'],
    },
    hourly_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    accepts_insurance: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    insurance_providers: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      defaultValue: [],
    },
    availability_schedule: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    video_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    voice_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    chat_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    rating_average: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
    },
    rating_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_sessions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_accepting_clients: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    verification_documents: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    stripe_account_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    tableName: 'therapists',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id'],
      },
      {
        fields: ['license_verification_status'],
      },
      {
        fields: ['specializations'],
        using: 'GIN',
      },
      {
        fields: ['is_accepting_clients'],
      },
    ],
  }
);

// Define associations
Therapist.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

User.hasOne(Therapist, {
  foreignKey: 'user_id',
  as: 'therapist_profile',
});

export default Therapist;