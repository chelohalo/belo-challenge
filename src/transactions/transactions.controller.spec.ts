import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionStatus } from './entities/transaction.entity';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  const mockUser1 = {
    id: 1,
    name: 'User 1',
    email: 'user1@example.com',
    balance: 100000,
  };

  const mockUser2 = {
    id: 2,
    name: 'User 2',
    email: 'user2@example.com',
    balance: 50000,
  };

  const createMockTransaction = (amount: number) => ({
    id: 1,
    origin: mockUser1,
    destination: mockUser2,
    amount,
    status:
      amount > 50000 ? TransactionStatus.PENDING : TransactionStatus.CONFIRMED,
    createdAt: new Date(),
  });

  const mockTransactionsService = {
    create: jest
      .fn()
      .mockImplementation((originId, destinationId, amount) =>
        Promise.resolve(createMockTransaction(amount)),
      ),
    findAll: jest.fn().mockResolvedValue([createMockTransaction(50000)]),
    approve: jest.fn().mockImplementation((id) =>
      Promise.resolve({
        ...createMockTransaction(60000),
        id,
        status: TransactionStatus.CONFIRMED,
      }),
    ),
    reject: jest.fn().mockImplementation((id) =>
      Promise.resolve({
        ...createMockTransaction(60000),
        id,
        status: TransactionStatus.REJECTED,
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const createTransactionDto = {
        originId: 1,
        destinationId: 2,
        amount: 25000,
      };

      const result = await controller.create(createTransactionDto);

      expect(result).toBeDefined();
      expect(result.origin.id).toBe(createTransactionDto.originId);
      expect(result.destination.id).toBe(createTransactionDto.destinationId);
      expect(result.amount).toBe(createTransactionDto.amount);
      expect(service.create).toHaveBeenCalledWith(
        createTransactionDto.originId,
        createTransactionDto.destinationId,
        createTransactionDto.amount,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of transactions', async () => {
      const result = await controller.findAll(1);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(service.findAll).toHaveBeenCalledWith(1);
    });
  });

  describe('approve', () => {
    it('should approve a transaction', async () => {
      const result = await controller.approve(1);

      expect(result).toBeDefined();
      expect(result.status).toBe(TransactionStatus.CONFIRMED);
      expect(service.approve).toHaveBeenCalledWith(1);
    });
  });

  describe('reject', () => {
    it('should reject a transaction', async () => {
      const result = await controller.reject(1);

      expect(result).toBeDefined();
      expect(result.status).toBe(TransactionStatus.REJECTED);
      expect(service.reject).toHaveBeenCalledWith(1);
    });
  });
});
