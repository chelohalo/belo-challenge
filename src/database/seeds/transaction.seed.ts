import { DataSource } from 'typeorm';
import {
  Transaction,
  TransactionStatus,
} from '../../transactions/entities/transaction.entity';
import { User } from '../../users/entities/user.entity';

export const transactionSeeder = async (dataSource: DataSource) => {
  const transactionRepository = dataSource.getRepository(Transaction);
  const userRepository = dataSource.getRepository(User);

  const users = await userRepository.find();
  if (users.length < 2) {
    console.log('❌ Need at least 2 users to seed transactions');
    return;
  }

  const transactions = [
    {
      origin: users[0],
      destination: users[1],
      amount: 25000,
      status: TransactionStatus.CONFIRMED,
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      origin: users[1],
      destination: users[2],
      amount: 60000,
      status: TransactionStatus.PENDING,
      createdAt: new Date(Date.now() - 43200000),
    },
    {
      origin: users[2],
      destination: users[0],
      amount: 15000,
      status: TransactionStatus.CONFIRMED,
      createdAt: new Date(),
    },
  ];

  for (const transaction of transactions) {
    const existingTransaction = await transactionRepository.findOne({
      where: {
        origin: { id: transaction.origin.id },
        destination: { id: transaction.destination.id },
        amount: transaction.amount,
        createdAt: transaction.createdAt,
      },
    });

    if (!existingTransaction) {
      await transactionRepository.save(transaction);
    }
  }

  console.log('✅ Transactions seeded successfully');
};
