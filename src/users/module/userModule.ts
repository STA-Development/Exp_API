import { UsersController } from '../controller/userController';
import { UsersService } from '../service/userService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../entity/user';
import { UserRepository } from '../repository/userRepository';
import { JwtModule } from '@nestjs/jwt';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { Pivot } from '../../events/entity/pivot';
import { CloudinaryProvider } from '../../cloudinary/cloudinaryProvider';
import { CloudinaryService } from '../../cloudinary/cloudinaryService';
import { logger } from '../../logger';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, Pivot]),
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
      socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
    }),

    JwtModule.register({})
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserRepository,
    CloudinaryService,
    CloudinaryProvider
  ]
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger).forRoutes(UsersController);
  }
}
