import { OverviewStatisticsDto } from './dtos/overview-statistics.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ContestStatisticsDto } from './dtos/contest-statistic.dto';
import { SubmissionService } from '../submission/submission.service';
import { UserContestStatisticDto } from './dtos/user-contest-statistic.dto';
import { Submission } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Message } from '../common/constants/message';

interface IStatisticsService {
  getOverviewStatistics(): Promise<OverviewStatisticsDto>;
  getContestStatistics(contestId: number): Promise<ContestStatisticsDto>;
  getContestsByUser(userId: number): Promise<UserContestStatisticDto[]>;
}

@Injectable()
export class StatisticsService implements IStatisticsService {
  constructor(
    private submissionService: SubmissionService,
    private prisma: PrismaService,
  ) {}

  async getOverviewStatistics(): Promise<OverviewStatisticsDto> {
    const submissions = await this.submissionService.findAll();
    return this.calculateSharedStatistics(submissions);
  }

  async getContestStatistics(contestId: number): Promise<ContestStatisticsDto> {
    const contest = await this.prisma.contest.findUnique({
      where: {
        id: contestId,
      },
    });

    if (!contest) {
      throw new NotFoundException(Message.CONTEST_NOT_FOUND);
    }

    // same as getOverviewStatistics but only for a specific contest
    const contestSubmissions =
      await this.submissionService.findAllSubmissionByContest(contestId);

    return this.calculateSharedStatistics(contestSubmissions);
  }

  async getContestsByUser(userId: number): Promise<UserContestStatisticDto[]> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(Message.USER_NOT_FOUND);
    }

    const submissions = await this.prisma.submission.findMany({
      where: {
        userId,
      },
      include: {
        contest: true,
      },
    });

    return submissions.map((submission) => ({
      submissionId: submission.id,
      contest: submission.contest,
      score: submission.score,
      isCompleted: submission.score !== null,
      totalTime: submission.totalTime,
      startTime: submission.createdAt,
    }));
  }

  private calculateSharedStatistics(submissions: Submission[]) {
    // count number of submissions completed (have final result)
    const completedSubmissions = submissions.filter(
      (submission) => submission.score !== null,
    );

    const totalSubmissions = submissions.length;
    const totalCompletedSubmissions = completedSubmissions.length;
    const completionPercentage = totalSubmissions
      ? (totalCompletedSubmissions / totalSubmissions) * 100
      : 0;
    const averageScore =
      totalCompletedSubmissions > 0
        ? completedSubmissions.reduce(
            (acc, submission) => acc + submission.score,
            0,
          ) / totalCompletedSubmissions
        : 0;

    const scoreDistribution = this.getScoreDistribution(completedSubmissions);

    return {
      totalSubmissions,
      totalCompletedSubmissions,
      completionPercentage,
      averageScore,
      scoreDistribution,
    };
  }

  private getScoreDistribution(completedSubmissions: Submission[]): Array<{
    score: number;
    percentage: number;
  }> {
    const scoreDistribution = completedSubmissions.reduce((acc, submission) => {
      const score = submission.score ?? 0;
      acc[score] = acc[score] ? acc[score] + 1 : 1;
      return acc;
    }, {});

    const totalSubmissions = completedSubmissions.length;
    return Object.keys(scoreDistribution).map((score) => ({
      score: parseInt(score, 10),
      percentage: (scoreDistribution[score] / totalSubmissions) * 100,
    }));
  }
}
