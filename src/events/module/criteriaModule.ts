import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {ConfigModule} from '@nestjs/config'
import {CriteriaController} from '../controller/criteriaController'
import {Criteria} from '../entity/criteria'
import {CriteriaRepository} from '../repository/criteriaRepository'
import {CriteriaService} from '../service/criteriaService'
import {UserSubCriteria} from '../entity/userSubCriteria'
import {SubCriteria} from '../entity/subCriteria'
import {SubCriteriaRepository} from '../repository/subCriteriaRepository'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Criteria, UserSubCriteria, SubCriteria]),
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
    }),
  ],
  controllers: [CriteriaController],
  providers: [CriteriaService, CriteriaRepository, SubCriteriaRepository],
})
export class CriteriaModule {}
