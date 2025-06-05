import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import databaseConfig from './config/database.config';
import { runSeeders } from './database/seeds';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const config = configService.get('database');
        return {
          ...config,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    TransactionsModule,
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    if (this.configService.get('NODE_ENV') === 'development') {
      const dataSource = new DataSource({
        ...this.configService.get('database'),
      });

      dataSource.initialize().then(() => {
        runSeeders(dataSource);
      });
    }
  }
}
