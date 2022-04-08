import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import { EventsController } from "../controller/eventController";
import { EventsService } from "../service/eventService";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { Event } from "../entity/event";
import { EventsRepository } from "../repository/eventRepository";
import { User } from "../../users/entity/user";
import { UserRepository } from "../../users/repository/userRepository";
import {CriteriaRepository} from "../repository/criteriaRepository";
import {Criteria} from "../entity/criteria";
import {Rating} from "../entity/rating";
import {RatingRepository} from "../repository/ratingRepository";
import {logger} from "../../logger";

@Module({
  imports: [// forwardRef(()=> Logger),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Event, User, Criteria, Rating]),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
    }),

  ],
  controllers: [EventsController],
  providers: [EventsService, EventsRepository, UserRepository, CriteriaRepository, RatingRepository ],

})

export class EventModule implements  NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(logger)                            ////////////////////////////
        .forRoutes(EventsController);
  }
}
