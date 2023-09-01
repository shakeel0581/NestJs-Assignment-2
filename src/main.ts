import { CustomInterceptor } from './interceptors/task.interceptor';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function loggerMiddleWare(req, res, next) {
  console.log('Request received:', req.method, req.url);
  next();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // app.use(loggerMiddleWare);
  // app.useGlobalInterceptors(new CustomInterceptor);
  await app.listen(3000);
}
bootstrap();
