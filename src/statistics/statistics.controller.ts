import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import ResponseDto from '../common/constants/response.dto';

@Controller('admin/statistics')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @Get()
  async getOverviewStatistics() {
    return ResponseDto.successDefault(
      await this.statisticsService.getOverviewStatistics(),
    );
  }

  @Get('/contests/:contestId')
  async getContestStatistics(
    @Param('contestId', ParseIntPipe) contestId: number,
  ) {
    return ResponseDto.successDefault(
      await this.statisticsService.getContestStatistics(contestId),
    );
  }

  @Get('/users/:userId')
  async getContestsByUser(@Param('userId', ParseIntPipe) userId: number) {
    return ResponseDto.successDefault(
      await this.statisticsService.getContestsByUser(userId),
    );
  }
}
