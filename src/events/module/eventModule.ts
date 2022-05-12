import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EventsController } from '../controller/eventController';
import { EventsService } from '../service/eventService';
import { Event } from '../entity/event';
import { EventsRepository } from '../repository/eventRepository';
import { User } from '../../users/entity/user';
import { UserRepository } from '../../users/repository/userRepository';
import { CriteriaRepository } from '../repository/criteriaRepository';
import { Criteria } from '../entity/criteria';
import { Rating } from '../entity/rating';
import { RatingRepository } from '../repository/ratingRepository';
import { UserSubCriteria } from '../entity/userSubCriteria';
import { EventEvaluator } from '../entity/eventEvaluator';
import { EventEvaluatee } from '../entity/eventEvaluatee';
import { SubCriteriaRepository } from '../repository/subCriteriaRepository';
import { SubCriteria } from '../entity/subCriteria';
import { IsKeyValueValidate } from '../../utils/keyValueValidation';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      Event,
      User,
      Criteria,
      Rating,
      SubCriteria,
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
      synchronize: true
    }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_KEY,
      signOptions: { expiresIn: process.env.JWT_MODULE_KEY_EXPIRES_IN }
    })
  ],
  controllers: [EventsController],
  providers: [
    EventsService,
    EventsRepository,
    UserRepository,
    CriteriaRepository,
    SubCriteriaRepository,
    RatingRepository
    IsKeyValueValidate
  ]
})
export class EventModule {}
