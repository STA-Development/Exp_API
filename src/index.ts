import { NestFactory } from '@nestjs/core';
import { UserModule } from './module/userModule';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(UserModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );
  await app.listen(3000);
}

bootstrap();
