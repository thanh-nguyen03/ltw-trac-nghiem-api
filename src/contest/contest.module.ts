import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ContestService } from './contest.service';
import { AdminContestController } from './admin-contest.controller';
import { SubmissionModule } from '../submission/submission.module';
import { ContestController } from './contest.controller';

@Module({
  imports: [PrismaModule, SubmissionModule],
  controllers: [AdminContestController, ContestController],
  providers: [ContestService],
})
export class ContestModule {}
