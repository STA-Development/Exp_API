import {NestFactory} from '@nestjs/core';
<<<<<<< HEAD
import {ValidationPipe} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

import {EventsModule } from './events/module/appModule';
import {UserModule } from './users/module/userModule';

async function bootstrap() {
  const eventApp = await NestFactory.create( EventsModule );
    const eventConfig = new DocumentBuilder()
        .setTitle('Events')
        .setDescription('The events API description')
        .setVersion('1.0')
        .addTag('events')
        .build();
    const eventDocument = SwaggerModule.createDocument(eventApp, eventConfig);
    SwaggerModule.setup('swaggerEvents', eventApp, eventDocument);
    eventApp.useGlobalPipes(
=======
import {AppModule} from './module/appModule';
import {ValidationPipe} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder()
        .setTitle('Evaluation')
        .setDescription('The evaluation API description')
        .setVersion('1.0')
        .addTag('eval')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(
>>>>>>> 9112754b3b0160c9a090d571a6dd96a0e27d0051
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
  );
<<<<<<< HEAD
    await eventApp.listen(3030);

    const userApp = await NestFactory.create( UserModule );
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
=======
  await app.listen(3000);
}

bootstrap();
// createConnection(/*...*/).then(connection => {
//
//     let user = new Users();
//     user.firstname = "Me and Bears";
//     user.lastname = "I am near polar bears";
//     user.email = "users-with-bears.jpg";
//
//     return connection.manager
//         .save(user)
//         .then(user => {
//             console.log("Photo has been saved. Photo id is", user.id);
//         });
//
// }).catch(error => console.log(error));

// createConnection({
//     type: "mysql",
//     host: "localhost",
//     port: 3307,             //process.env.DB_USERNAME,
//     username: "root",
//     password: "root",
//     database: "evaluation",
//     entities: [
//         User
//     ],
//     //controllers: [AppController],
//     //providers: [AppService],
//     synchronize: true,
//     socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
// }).then(async connection => {      // inch connection
//
//     let user = new User();
//     user.firstname = "Me and Bees";
//     user.lastname = "I am near small bees";
//     user.email = "@@@@@@@";
//
//     let photoRepository = connection.getRepository(User);
//
//     await photoRepository.save(user);
//     console.log("Photo has been saved");
//
//     let savedPhotos = await photoRepository.find();
//     console.log("All photos from the db: ", savedPhotos);
//
// }).catch(error => console.log(error));

//
// let user = new Users();
// user.firstname = "Me and Bears";
// user.lastname = "I am near polar bears";
// user.email = "users-with-bears.jpg";
//
// return connection.manager
//     .save(user)
//     .then(user => {
//         console.log("Photo has been saved. Photo id is", user.id);
//     });
>>>>>>> 9112754b3b0160c9a090d571a6dd96a0e27d0051
