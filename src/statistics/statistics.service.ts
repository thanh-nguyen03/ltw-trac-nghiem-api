import { OverviewStatisticsDto } from './dtos/overview-statistics.dto';
import { Injectable } from '@nestjs/common';
import { ContestStatisticsDto } from './dtos/contest-statistic.dto';
import { ContestService } from '../contest/contest.service';
import { SubmissionService } from '../submission/submission.service';
import { UserContestStatisticDto } from './dtos/user-contest-statistic.dto';
import { UserService } from '../user/user.service';

interface IStatisticsService {
  getOverviewStatistics(): Promise<OverviewStatisticsDto>;
  getContestStatistics(contestId: number): Promise<ContestStatisticsDto>;
  getContestsByUser(fullName: string): Promise<UserContestStatisticDto[]>;
}

@Injectable()
export class StatisticsService implements IStatisticsService {
  constructor(
    private contestService: ContestService,
    private submissionService: SubmissionService,
    private userService: UserService,
  ) {}

  getOverviewStatistics(): Promise<OverviewStatisticsDto> {
    return Promise.resolve(undefined);
  }

  getContestStatistics(contestId: number): Promise<ContestStatisticsDto> {
    return Promise.resolve(undefined);
  }

  getContestsByUser(fullName: string): Promise<UserContestStatisticDto[]> {
    return Promise.resolve([]);
  }
}
