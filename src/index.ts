import {NestFactory} from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {EventsModule } from './events/module/eventAppModule';
import {UserModule } from './users/module/userModule';
import {createLogger, loggers} from "winston";
import {eventLogger} from "./logger";
//import { createLogger } from './logger'


async function bootstrap():Promise<void> {
    const eventApp = await NestFactory.create( EventsModule,
        {
            logger: eventLogger,                   //process.env.NODE_ENV === "development" ?  eventLogger : createLogger()
            bufferLogs: true,
            autoFlushLogs: false,
        }
    );
  //  console.log(eventLogger)
 //   eventApp.useLogger(eventApp.get(eventLogger));
    const eventConfig = new DocumentBuilder()
        .setTitle('Events')
        .setDescription('The events API description')
        .setVersion('1.0')
        .addTag('events')
        .build();
    const eventDocument = SwaggerModule.createDocument(eventApp, eventConfig);
    SwaggerModule.setup('swaggerEvents', eventApp, eventDocument);
    eventApp.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );
    await eventApp.listen(3030);

    const userApp = await NestFactory.create( UserModule,
        {
            logger: eventLogger,            //process.env.NODE_ENV === "development" ?  userLogger : createLogger()
           // bufferLogs: true,
          //  autoFlushLogs: false,
        }
    );
  //  userApp.useLogger(userApp.get(userLogger));
    const userConfig = new DocumentBuilder()
        .setTitle('Users')
        .setDescription('The users API description')
        .setVersion('1.0')
        .addTag('users')
        .build();
    const document = SwaggerModule.createDocument(userApp, userConfig);
    SwaggerModule.setup('swaggerUsers', userApp, document);
    userApp.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );
    await userApp.listen(3000);

}

bootstrap();
