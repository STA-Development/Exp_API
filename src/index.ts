import { NestFactory } from '@nestjs/core';
import { UserModule } from './module/userModule';
import { ValidationPipe } from '@nestjs/common';
// import * as cookieParser from "cookie-parser";
async function bootstrap() {
  const app = await NestFactory.create(UserModule);
    // app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );
  await app.listen(3000);
}

bootstrap();
