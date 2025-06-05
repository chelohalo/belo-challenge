import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { Transaction, TransactionStatus } from './entities/transaction.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { BadRequestException } from '@nestjs/common';

describe('TransactionsService', () => {
  let service: TransactionsService;

  const mockUser1 = {
    id: 1,
    name: 'User 1',
    email: 'user1@example.com',
    balance: 100000,
  } as User;

  const mockUser2 = {
    id: 2,
    name: 'User 2',
    email: 'user2@example.com',
    balance: 0,
  } as User;

  const createMockTransaction = (amount: number) =>
    ({
      id: 1,
      origin: mockUser1,
      destination: mockUser2,
      amount,
      status:
        amount > 50000
          ? TransactionStatus.PENDING
          : TransactionStatus.CONFIRMED,
      createdAt: new Date(),
    }) as Transaction;

  const mockRepository = {
    create: jest.fn().mockImplementation((data) => ({
      ...data,
      id: 1,
      createdAt: new Date(),
    })),
    save: jest
      .fn()
      .mockImplementation((transaction) => Promise.resolve(transaction)),
    findOne: jest.fn().mockResolvedValue(createMockTransaction(50000)),
    find: jest.fn().mockResolvedValue([createMockTransaction(50000)]),
  };

  const mockUsersService = {
    findOne: jest.fn().mockImplementation((id) => {
      if (id === 1) return Promise.resolve(mockUser1);
      if (id === 2) return Promise.resolve(mockUser2);
      return Promise.resolve(null);
    }),
    updateBalance: jest.fn().mockImplementation((id, amount) => {
      const user = id === 1 ? mockUser1 : mockUser2;
      return Promise.resolve({
        ...user,
        balance: Number(user.balance) + Number(amount),
      });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a pending transaction for amounts over 50000', async () => {
      const result = await service.create(1, 2, 60000);
      expect(result.status).toBe(TransactionStatus.PENDING);
    });

    it('should create a confirmed transaction for amounts under 50000', async () => {
      const result = await service.create(1, 2, 40000);
      expect(result.status).toBe(TransactionStatus.CONFIRMED);
    });

    it('should throw BadRequestException for insufficient balance', async () => {
      await expect(service.create(2, 1, 100000)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('approve', () => {
    it('should approve a pending transaction', async () => {
      mockRepository.findOne.mockResolvedValueOnce(
        createMockTransaction(60000),
      );
      const result = await service.approve(1);
      expect(result.status).toBe(TransactionStatus.CONFIRMED);
    });

    it('should throw BadRequestException for non-pending transaction', async () => {
      mockRepository.findOne.mockResolvedValueOnce(
        createMockTransaction(40000),
      );
      await expect(service.approve(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('reject', () => {
    it('should reject a pending transaction', async () => {
      mockRepository.findOne.mockResolvedValueOnce(
        createMockTransaction(60000),
      );
      const result = await service.reject(1);
      expect(result.status).toBe(TransactionStatus.REJECTED);
    });

    it('should throw BadRequestException for non-pending transaction', async () => {
      mockRepository.findOne.mockResolvedValueOnce(
        createMockTransaction(40000),
      );
      await expect(service.reject(1)).rejects.toThrow(BadRequestException);
    });
  });
});
