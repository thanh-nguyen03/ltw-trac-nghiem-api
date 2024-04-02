import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SubmissionService } from './submission.service';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [SubmissionService],
  exports: [SubmissionService],
})
export class SubmissionModule {}
