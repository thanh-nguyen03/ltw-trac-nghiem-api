import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ContestService } from './contest.service';
import ResponseDto from '../common/constants/response.dto';
import { ContestDto } from './dtos/contest.dto';
import { ContestQuestionDto } from './dtos/contest-question.dto';
import { IsRole } from '../common/decorators/role.decorator';
import { Role, User } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('admin/contests')
@IsRole(Role.ADMIN)
export class AdminContestController {
  constructor(private contestService: ContestService) {}

  @Get()
  async getContests() {
    return ResponseDto.successDefault(await this.contestService.findAll());
  }

  @Get(':id')
  async getContest(@Param('id', ParseIntPipe) id: number) {
    return ResponseDto.successDefault(
      await this.contestService.getContestForAdmin(id),
    );
  }

  @Post()
  async createContest(
    @Body() createContestDto: ContestDto,
    @CurrentUser() user: User,
  ) {
    return ResponseDto.successDefault(
      await this.contestService.createContest(createContestDto, user.id),
    );
  }

  @Put(':id')
  async updateContest(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContestDto: ContestDto,
  ) {
    return ResponseDto.successDefault(
      await this.contestService.updateContest(id, updateContestDto),
    );
  }

  @Delete(':id')
  async deleteContest(@Param('id', ParseIntPipe) id: number) {
    return ResponseDto.successDefault(
      await this.contestService.deleteContest(id),
    );
  }

  @Post(':id/questions')
  async addAndUpdateQuestions(
    @Param('id', ParseIntPipe) contestId: number,
    @Body(new ParseArrayPipe({ items: ContestQuestionDto }))
    questions: ContestQuestionDto[],
  ) {
    return ResponseDto.successDefault(
      await this.contestService.addAndUpdateQuestions(contestId, questions),
    );
  }

  @Delete(':id/questions')
  async deleteQuestion(
    @Param('id', ParseIntPipe) contestId: number,
    @Body(new ParseArrayPipe({ items: Number }))
    questionIds: number[],
  ) {
    return ResponseDto.successDefault(
      await this.contestService.deleteQuestions(contestId, questionIds),
    );
  }
}
