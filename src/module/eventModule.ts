import { Module } from "@nestjs/common";
import { EventsController } from "../controller/eventController";
import { EventsService } from "../service/eventService";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { Event } from "../entity/event";
import { EventsRepository } from "../repository/eventRepository";
import { User } from "../entity/user";
import { UserRepository } from "../repository/userRepository";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Event, User]),
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
  providers: [EventsService, EventsRepository, UserRepository],
})

export class EventModule {}
