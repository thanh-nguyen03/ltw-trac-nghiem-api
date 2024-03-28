import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import configuration from './common/constants/configuration';
import { ContestModule } from './contest/contest.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
    ContestModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
