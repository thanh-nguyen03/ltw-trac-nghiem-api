export class OverviewStatisticsDto {
  totalStarted: number;
  totalSubmissions: number;
  averageScore: number;
  // score distribution percentage
  scoreDistribution: Array<{
    score: number;
    percentage: number;
  }>;
}
