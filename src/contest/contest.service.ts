import { ContestDto } from './dtos/contest.dto';
import { Contest } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Message } from '../common/constants/message';
import { ContestQuestionDto } from './dtos/contest-question.dto';

interface IContestService {
  findAll(): Promise<Contest[]>;
  getContestForAdmin(id: number): Promise<Contest>;
  getContestForUser(id: number): Promise<Contest>;
  createContest(createContestDto: ContestDto): Promise<Contest>;
  updateContest(
    contestId: number,
    updateContestDto: ContestDto,
  ): Promise<Contest>;
  deleteContest(contestId: number): Promise<Contest>;

  // questions
  saveQuestions(
    contestId: number,
    questions: ContestQuestionDto[],
  ): Promise<Contest>;
}

@Injectable()
export class ContestService implements IContestService {
  constructor(private prisma: PrismaService) {}

  async createContest(createContestDto: ContestDto): Promise<Contest> {
    const { authorId } = createContestDto;

    const author = await this.prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!author) {
      throw new BadRequestException(Message.USER_NOT_FOUND);
    }

    return this.prisma.contest.create({
      data: createContestDto,
    });
  }

  async updateContest(
    contestId: number,
    updateContestDto: ContestDto,
  ): Promise<Contest> {
    const contest = this.getContestForAdmin(contestId);

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

  async deleteContest(contestId: number): Promise<Contest> {
    const contest = this.getContestForAdmin(contestId);

    if (!contest) {
      throw new BadRequestException(Message.CONTEST_NOT_FOUND);
    }

    return this.prisma.contest.delete({
      where: { id: contestId },
    });
  }

  async findAll(): Promise<Contest[]> {
    return this.prisma.contest.findMany({
      include: {
        author: true,
        questions: true,
      },
    });
  }

  async getContestForAdmin(id: number): Promise<Contest> {
    const contest = await this.prisma.contest.findUnique({
      where: { id },
      include: {
        author: true,
        questions: true,
      },
    });

    if (!contest) {
      throw new BadRequestException(Message.CONTEST_NOT_FOUND);
    }

    return contest;
  }

  async getContestForUser(id: number): Promise<Contest> {
    const contest = await this.prisma.contest.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            options: {
              select: {
                id: true,
                number: true,
                content: true,
              },
            },
          },
        },
      },
    });

    if (!contest) {
      throw new BadRequestException(Message.CONTEST_NOT_FOUND);
    }

    return contest;
  }

  async saveQuestions(
    contestId: number,
    questions: ContestQuestionDto[],
  ): Promise<Contest> {
    const contest = await this.getContestForAdmin(contestId);

    if (!contest) {
      throw new BadRequestException(Message.CONTEST_NOT_FOUND);
    }

    // Check if valid question options
    questions.forEach((question) => {
      if (question.options.length < 2) {
        throw new BadRequestException(Message.QUESTION_OPTIONS_INVALID);
      }

      const correctOptions = question.options.filter(
        (option) => option.isCorrect,
      );

      if (correctOptions.length !== 1) {
        throw new BadRequestException(Message.QUESTION_CORRECT_OPTIONS_INVALID);
      }
    });

    return this.prisma.contest.update({
      where: { id: contestId },
      data: {
        questions: {
          deleteMany: {},
          create: questions.map((question) => ({
            ...question,
            options: {
              create: question.options,
            },
          })),
        },
      },
      include: {
        author: true,
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  }
}
