import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ description: 'ID of the user sending the money' })
  @IsNumber()
  @IsPositive()
  originId: number;

  @ApiProperty({ description: 'ID of the user receiving the money' })
  @IsNumber()
  @IsPositive()
  destinationId: number;

  @ApiProperty({ description: 'Amount to transfer' })
  @IsNumber()
  @IsPositive()
  amount: number;
}
