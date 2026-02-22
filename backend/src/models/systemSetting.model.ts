import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ISystemSetting {
    id: string;
    key: string;
    value: any;
    description?: string;
    created_at?: Date;
    updated_at?: Date;
}

interface SystemSettingCreationAttributes extends Optional<ISystemSetting, 'id' | 'description' | 'created_at' | 'updated_at'> { }

class SystemSetting extends Model<ISystemSetting, SystemSettingCreationAttributes> implements ISystemSetting {
    public id!: string;
    public key!: string;
    public value!: any;
    public description?: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

SystemSetting.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        key: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        value: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
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
        tableName: 'system_settings',
        timestamps: true,
        underscored: true,
    }
);

export default SystemSetting;
