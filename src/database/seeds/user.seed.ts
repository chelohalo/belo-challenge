import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export const userSeeder = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);

  const users = [
    {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      balance: 100000,
    },
    {
      name: 'María García',
      email: 'maria@example.com',
      balance: 50000,
    },
    {
      name: 'Carlos López',
      email: 'carlos@example.com',
      balance: 75000,
    },
  ];

  for (const user of users) {
    const existingUser = await userRepository.findOne({
      where: { email: user.email },
    });

    if (!existingUser) {
      await userRepository.save(user);
    }
  }

  console.log('✅ Users seeded successfully');
};
