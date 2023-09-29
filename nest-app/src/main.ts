import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import "reflect-metadata"
import { UserMiddleware } from './user/user.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console,
  });
  app.enableCors({
    credentials: true,
    origin:[
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ]
  })
  await app.listen(8000);
}
bootstrap();
