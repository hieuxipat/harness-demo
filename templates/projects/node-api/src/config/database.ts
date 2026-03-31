import { DataSource } from 'typeorm';
import mongoose from 'mongoose';
import { env } from './env';

// TypeORM (SQL)
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.name,
  synchronize: env.nodeEnv === 'development',
  logging: env.nodeEnv === 'development',
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
});

// Mongoose (MongoDB)
export const connectMongo = async () => {
  await mongoose.connect(env.mongoUri);
  console.log('Connected to MongoDB');
};
