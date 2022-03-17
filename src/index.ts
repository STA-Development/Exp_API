import { NestFactory } from '@nestjs/core';
import { UserModule } from './module/userModule';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(UserModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );
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
