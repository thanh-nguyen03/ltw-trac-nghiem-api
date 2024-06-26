import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { RemovePasswordInterceptor } from './common/interceptors/remove-password.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 8081;

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new RemovePasswordInterceptor());

  await app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
bootstrap();
