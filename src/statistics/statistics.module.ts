import { Module } from '@nestjs/common';
import { SubmissionModule } from '../submission/submission.module';
import { StatisticsService } from './statistics.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StatisticsController } from './statistics.controller';

@Module({
  imports: [SubmissionModule, PrismaModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
