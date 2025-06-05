import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionsService.create(
      createTransactionDto.originId,
      createTransactionDto.destinationId,
      createTransactionDto.amount,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions for a user' })
  @ApiResponse({ status: 200, description: 'Return all transactions' })
  async findAll(@Query('userId') userId: number): Promise<Transaction[]> {
    return this.transactionsService.findAll(userId);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve a pending transaction' })
  @ApiResponse({
    status: 200,
    description: 'Transaction approved successfully',
  })
  async approve(@Param('id') id: number): Promise<Transaction> {
    return this.transactionsService.approve(id);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject a pending transaction' })
  @ApiResponse({
    status: 200,
    description: 'Transaction rejected successfully',
  })
  async reject(@Param('id') id: number): Promise<Transaction> {
    return this.transactionsService.reject(id);
  }
}
