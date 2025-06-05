import { DataSource } from 'typeorm';
import { userSeeder } from './user.seed';
import { transactionSeeder } from './transaction.seed';

export const runSeeders = async (dataSource: DataSource) => {
  try {
    console.log('🌱 Starting database seeding...');

    await userSeeder(dataSource);
    await transactionSeeder(dataSource);

    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};
