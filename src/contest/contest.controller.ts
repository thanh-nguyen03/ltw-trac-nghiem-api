import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { SubmissionService } from '../submission/submission.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { CreateSubmissionDto } from '../submission/dtos/create-submission.dto';
import { ContestService } from './contest.service';
import ResponseDto from '../common/constants/response.dto';
import { ContestFilter } from './constants/contest-filter.query';

@Controller('contest')
export class ContestController {
  constructor(
    private contestService: ContestService,
    private submissionService: SubmissionService,
  ) {}

  @Get()
  async getContests(@Query() query: ContestFilter) {
    return ResponseDto.successDefault(await this.contestService.findAll(query));
  }

  @Get(':contestId')
  async startContest(
    @Param('contestId', ParseIntPipe) contestId: number,
    @CurrentUser() user: User,
  ) {
    return ResponseDto.successDefault(
      await this.contestService.startContest(contestId, user.id),
    );
  }

  @Post('/submit/:submissionId')
  async createSubmission(
    @Param('submissionId', ParseIntPipe) submissionId: number,
    @Body() createSubmissionDto: CreateSubmissionDto,
  ) {
    return ResponseDto.successDefault(
      await this.submissionService.judgeSubmission(
        submissionId,
        createSubmissionDto,
      ),
    );
  }
}
