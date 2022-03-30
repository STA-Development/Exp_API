import { Module } from '@nestjs/common';
import { UsersController } from '../controller/userController';
import { UsersService } from '../service/userService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../entity/user';
import { UsersRepository } from '../repository/userRepository';
import {JwtModule} from "@nestjs/jwt";
import { CloudinaryProvider } from '../cloudinary/cloudinaryProvider';
import { CloudinaryService } from '../cloudinary/cloudinaryService';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
    }),
    JwtModule.register({
      secret: 'secret',
      signOptions: {expiresIn: '1d'}
    }),

  ],


  controllers: [UsersController],
  providers: [UsersService, UsersRepository,CloudinaryService,CloudinaryProvider]
})
export class UserModule {}
