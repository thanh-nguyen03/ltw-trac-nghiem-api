import { ContestDto } from './dtos/contest.dto';
import { Contest } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Message } from '../common/constants/message';

interface IContestService {
  findAll(): Promise<Contest[]>;
  getContest(id: number): Promise<Contest>;
  createContest(createContestDto: ContestDto): Promise<Contest>;
  updateContest(
    contestId: number,
    updateContestDto: ContestDto,
  ): Promise<Contest>;
  deleteContest(contestId: number): Promise<Contest>;
}

@Injectable()
export class ContestService implements IContestService {
  constructor(private prisma: PrismaService) {}

  createContest(createContestDto: ContestDto): Promise<Contest> {
    return this.prisma.contest.create({
      data: createContestDto,
    });
  }

  updateContest(
    contestId: number,
    updateContestDto: ContestDto,
  ): Promise<Contest> {
    const contest = this.getContest(contestId);

    if (!contest) {
      throw new BadRequestException(Message.CONTEST_NOT_FOUND);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { authorId, ...rest } = updateContestDto;

    return this.prisma.contest.update({
      where: { id: contestId },
      data: rest,
    });
  }

  deleteContest(contestId: number): Promise<Contest> {
    const contest = this.getContest(contestId);

    if (!contest) {
      throw new BadRequestException(Message.CONTEST_NOT_FOUND);
    }

    return this.prisma.contest.delete({
      where: { id: contestId },
    });
  }

  findAll(): Promise<Contest[]> {
    return this.prisma.contest.findMany({
      include: {
        author: true,
      },
    });
  }

  getContest(id: number): Promise<Contest> {
    return this.prisma.contest.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });
  }
}
