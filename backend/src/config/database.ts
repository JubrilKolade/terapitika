import { Sequelize, Options } from 'sequelize';
import config from './environment';

const sequelizeConfig: Options = {
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  username: config.database.user,
  password: config.database.password,
  dialect: 'postgres',
  logging: config.env === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl: config.database.ssl ? {
      require: true,
      rejectUnauthorized: false,
    } : false,
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
};

// Create Sequelize instance
const sequelize = new Sequelize(sequelizeConfig);

// Test database connection
export async function testConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');
  } catch (error) {
    console.error('✗ Unable to connect to the database:', error);
    throw error;
  }
}

// Sync database (only in development)
export async function syncDatabase(force = false): Promise<void> {
  if (config.env === 'development') {
    try {
      await sequelize.sync({ force });
      console.log('✓ Database synchronized');
    } catch (error) {
      console.error('✗ Database sync failed:', error);
      throw error;
    }
  }
}

export default sequelize;