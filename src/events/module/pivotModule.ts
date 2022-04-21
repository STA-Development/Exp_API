import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {ConfigModule} from '@nestjs/config'
import {Criteria} from '../entity/criteria'
import {UserSubCriteria} from '../entity/userSubCriteria'
import {Event} from '../entity/event'
import {Rating} from '../entity/rating'
import {SubCriteria} from '../entity/subCriteria'
import {User} from '../../users/entity/user'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([UserSubCriteria, Criteria, Event, Rating, SubCriteria, User]),
    TypeOrmModule.forRoot({
      keepConnectionAlive: true,
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: false,
      logging: false,
      socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
    }),
  ],
})
export class CriteriaModule {}
