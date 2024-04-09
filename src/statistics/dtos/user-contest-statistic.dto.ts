import { ContestDto } from '../../contest/dtos/contest.dto';

export class UserContestStatisticDto {
  submissionId: number;
  contest: ContestDto;
  score: number;
  isCompleted: boolean;
  totalTime: number;
  startTime: Date;
}
