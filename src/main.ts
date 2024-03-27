import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 8081;
  await app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
bootstrap();
