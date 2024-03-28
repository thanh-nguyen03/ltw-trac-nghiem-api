import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ContestService } from './contest.service';
import { AdminContestController } from './admin-contest.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AdminContestController],
  providers: [ContestService],
})
export class ContestModule {}
