import { Module } from '@nestjs/common';
import { SubCriteriaController } from '../controller/subCriteriaController';
import { SubCriteriaService } from '../service/subCriteriaService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SubCriteria } from '../entity/subCriteria';
import { SubCriteriaRepository } from '../repository/subCriteriaRepository';
import { Pivot } from '../entity/pivot';
import { Criteria } from '../entity/criteria';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([SubCriteria, Pivot, Criteria]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      logging: false,
      socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
    })
  ],
  controllers: [SubCriteriaController],
  providers: [SubCriteriaService, SubCriteriaRepository]
})
export class SubCriteriaModule {}
