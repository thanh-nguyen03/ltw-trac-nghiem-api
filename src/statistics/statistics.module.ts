import { Module } from '@nestjs/common';
import { ContestModule } from '../contest/contest.module';
import { SubmissionModule } from '../submission/submission.module';
import { UserModule } from '../user/user.module';
import { StatisticsService } from './statistics.service';

@Module({
  imports: [ContestModule, SubmissionModule, UserModule],
  controllers: [],
  providers: [StatisticsService],
})
export class StatisticsModule {}
