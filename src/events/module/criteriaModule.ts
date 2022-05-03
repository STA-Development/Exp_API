import { Module } from '@nestjs/common';
import { CriteriaController } from '../controller/criteriaController';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Criteria } from '../entity/criteria';
import { CriteriaRepository } from '../repository/criteriaRepository';
import { CriteriaService } from '../service/criteriaService';
import { Pivot } from '../entity/pivot';
import { SubCriteria } from '../entity/subCriteria';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Criteria, Pivot, SubCriteria]),
    TypeOrmModule.forRoot({
      keepConnectionAlive: true,
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      logging: false
    })
  ],
  controllers: [CriteriaController],
  providers: [CriteriaService, CriteriaRepository]
})
export class CriteriaModule {}
