import {TypeOrmModule} from '@nestjs/typeorm'
import {ConfigModule} from '@nestjs/config'
import {JwtModule} from '@nestjs/jwt'
import {Module} from '@nestjs/common'
import {UsersController} from '../controller/userController'
import {UsersService} from '../service/userService'
import {User} from '../entity/user'
import {UserRepository} from '../repository/userRepository'
import {UserSubCriteria} from '../../events/entity/userSubCriteria'
import {CloudinaryProvider} from '../../cloudinary/cloudinaryProvider'
import {CloudinaryService} from '../../cloudinary/cloudinaryService'
import {logger} from '../../logger' //
import {EventEvaluator} from '../../events/entity/eventEvaluator'
import {EventEvaluatee} from '../../events/entity/eventEvaluatee'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, UserSubCriteria, EventEvaluator, EventEvaluatee]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      keepConnectionAlive: true,
      //socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
    }),

    JwtModule.register({}),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, CloudinaryService, CloudinaryProvider],
})
export class UserModule {}
