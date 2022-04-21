import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {ConfigModule} from '@nestjs/config'
import {SubCriteriaController} from '../controller/subCriteriaController'
import {SubCriteriaService} from '../service/subCriteriaService'
import {SubCriteria} from '../entity/subCriteria'
import {SubCriteriaRepository} from '../repository/subCriteriaRepository'
import {UserSubCriteria} from '../entity/userSubCriteria'
import {Criteria} from '../entity/criteria'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([SubCriteria, UserSubCriteria, Criteria]),
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
      socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
    }),
  ],
  controllers: [SubCriteriaController],
  providers: [SubCriteriaService, SubCriteriaRepository],
})
export class SubCriteriaModule {}
