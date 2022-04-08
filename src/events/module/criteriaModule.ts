import { Module } from "@nestjs/common";
import { CriteriaController } from "../controller/criteriaController";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { Criteria } from "../entity/criteria";
import { CriteriaRepository } from "../repository/criteriaRepository";
import { CriteriaService } from "../service/criteriaService";
import {SubCriteria} from "../entity/subCriteria";
import {SubCriteriaRepository} from "../repository/subCriteriaRepository";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([ Criteria, SubCriteria ]),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
    }),

  ],
  controllers: [ CriteriaController ],
  providers: [ CriteriaService, CriteriaRepository, SubCriteriaRepository ],
})

export class CriteriaModule {}