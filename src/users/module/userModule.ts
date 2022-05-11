import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from '../controller/userController';
import { UsersService } from '../service/userService';
import { UserRepository } from '../repository/userRepository';
import { CloudinaryProvider } from '../../cloudinary/cloudinaryProvider';
import { CloudinaryService } from '../../cloudinary/cloudinaryService';
import { User } from '../entity/user';
import { UserSubCriteria } from '../../events/entity/userSubCriteria';
import { EventEvaluator } from '../../events/entity/eventEvaluator';
import { EventEvaluatee } from '../../events/entity/eventEvaluatee';
import { PdfController } from '../controller/pdfController';
import { PdfService } from '../service/pdfService';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      User,
      UserSubCriteria,
      EventEvaluator,
      EventEvaluatee
    ]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      keepConnectionAlive: true
    }),

    JwtModule.register({})
  ],
  controllers: [UsersController, PdfController],
  providers: [
    UsersService,
    UserRepository,
    CloudinaryService,
    CloudinaryProvider,
    PdfService
  ]
})
export class UserModule {}
