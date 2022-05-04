import { Module } from '@nestjs/common';
import { RatingController } from '../controller/ratingController';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RatingRepository } from '../repository/ratingRepository';
import { RatingService } from '../service/ratingService';
import { Rating } from '../entity/rating';
import { Pivot } from '../entity/pivot';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Rating, Pivot]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      logging: false
    })
  ],
  controllers: [RatingController],
  providers: [RatingService, RatingRepository]
})
export class RatingModule {}
