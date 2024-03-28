import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ContestService } from './contest.service';
import ResponseDto from '../common/constants/response.dto';
import { ContestDto } from './dtos/contest.dto';
import { ContestQuestionInputDto } from './dtos/contest-question-input.dto';

@Controller('admin/contests')
export class AdminContestController {
  constructor(private contestService: ContestService) {}

  @Get()
  async getContests() {
    return ResponseDto.successDefault(await this.contestService.findAll());
  }

  @Get(':id')
  async getContest(@Param('id', ParseIntPipe) id: number) {
    return ResponseDto.successDefault(await this.contestService.getContest(id));
  }

  @Post()
  async createContest(@Body() createContestDto: ContestDto) {
    return ResponseDto.successDefault(
      await this.contestService.createContest(createContestDto),
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
  async addQuestions(
    @Param('id', ParseIntPipe) contestId: number,
    @Body() questions: ContestQuestionInputDto[],
  ) {
    return ResponseDto.successDefault(
      await this.contestService.saveQuestions(contestId, questions),
    );
  }
}
