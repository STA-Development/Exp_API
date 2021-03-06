import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EventsModule } from './events/module/eventAppModule';
import { UserModule } from './users/module/userModule';

async function bootstrap() {
  const eventApp = await NestFactory.create(EventsModule, { cors: true });
  const eventConfig = new DocumentBuilder()
    .setTitle('Events')
    .setDescription('The events API description')
    .setVersion('1.0')
    .build();
  const eventDocument = SwaggerModule.createDocument(eventApp, eventConfig);
  SwaggerModule.setup('swaggerEvents', eventApp, eventDocument);
  eventApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );
  await eventApp.listen(3030);

  const userApp = await NestFactory.create(UserModule, { cors: true });
  const userConfig = new DocumentBuilder()
    .setTitle('Users')
    .setDescription('The users API description')
    .setVersion('1.0')
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();
  const document = SwaggerModule.createDocument(userApp, userConfig);
  SwaggerModule.setup('swaggerUsers', userApp, document);
  userApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );

  await userApp.listen(3000);
}
bootstrap();
