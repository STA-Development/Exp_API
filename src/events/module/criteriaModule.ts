import { Module } from "@nestjs/common";
import { CriteriaController } from "../controller/criteriaController";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { Criteria } from "../entity/criteria";
import { CriteriaRepository } from "../repository/criteriaRepository";
import { CriteriaService } from "../service/criteriaService";
import { Pivot } from "../entity/pivot";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Criteria, Pivot]),
    TypeOrmModule.forRoot({
      keepConnectionAlive: true,
      type: "mysql",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      logging: false,
      socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
    }),
  ],
  controllers: [CriteriaController],
  providers: [CriteriaService, CriteriaRepository],
})
export class CriteriaModule {}
