export class OverviewStatisticsDto {
  totalSubmissions: number;
  totalCompletedSubmissions: number;
  averageScore: number;
  completionPercentage: number;
  scoreDistribution: Array<{
    score: number;
    percentage: number;
  }>;
}
