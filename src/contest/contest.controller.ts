import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { SubmissionService } from '../submission/submission.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { CreateSubmissionDto } from '../submission/dtos/create-submission.dto';
import { ContestService } from './contest.service';
import ResponseDto from '../common/constants/response.dto';

@Controller('contest')
export class ContestController {
  constructor(
    private contestService: ContestService,
    private submissionService: SubmissionService,
  ) {}

  @Get(':contestId')
  async startContest(@Param('contestId', ParseIntPipe) contestId: number) {
    return ResponseDto.successDefault(
      await this.contestService.getContestForUser(contestId),
    );
  }

  @Post('/:contestId/submit')
  async createSubmission(
    @Param('contestId', ParseIntPipe) contestId: number,
    @CurrentUser() user: User,
    @Body() createSubmissionDto: CreateSubmissionDto,
  ) {
    return ResponseDto.successDefault(
      await this.submissionService.createSubmission(
        contestId,
        user.id,
        createSubmissionDto,
      ),
    );
  }
}
