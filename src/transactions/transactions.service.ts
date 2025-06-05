import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionStatus } from './entities/transaction.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private usersService: UsersService,
  ) {}

  async create(
    originId: number,
    destinationId: number,
    amount: number,
  ): Promise<Transaction> {
    const origin = await this.usersService.findOne(originId);
    const destination = await this.usersService.findOne(destinationId);

    const originBalance = Number(origin.balance);
    const transactionAmount = Number(amount);

    if (originBalance < transactionAmount) {
      throw new BadRequestException('Insufficient balance');
    }

    const transaction = this.transactionsRepository.create({
      origin,
      destination,
      amount: transactionAmount,
      status:
        transactionAmount > 50000
          ? TransactionStatus.PENDING
          : TransactionStatus.CONFIRMED,
    });

    const savedTransaction =
      await this.transactionsRepository.save(transaction);

    if (savedTransaction.status === TransactionStatus.CONFIRMED) {
      await this.processTransaction(savedTransaction);
    }

    return savedTransaction;
  }

  async findAll(userId: number): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      where: [{ origin: { id: userId } }, { destination: { id: userId } }],
      relations: ['origin', 'destination'],
      order: { createdAt: 'DESC' },
    });
  }

  async approve(id: number): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
      relations: ['origin', 'destination'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException('Transaction is not pending');
    }

    const originBalance = Number(transaction.origin.balance);
    const transactionAmount = Number(transaction.amount);

    if (originBalance < transactionAmount) {
      throw new BadRequestException('Insufficient balance');
    }

    transaction.status = TransactionStatus.CONFIRMED;
    await this.processTransaction(transaction);
    return this.transactionsRepository.save(transaction);
  }

  async reject(id: number): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException('Transaction is not pending');
    }

    transaction.status = TransactionStatus.REJECTED;
    return this.transactionsRepository.save(transaction);
  }

  private async processTransaction(transaction: Transaction): Promise<void> {
    await this.usersService.updateBalance(
      transaction.origin.id,
      -Number(transaction.amount),
    );
    await this.usersService.updateBalance(
      transaction.destination.id,
      Number(transaction.amount),
    );
  }
}
