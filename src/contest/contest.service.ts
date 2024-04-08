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
  createContest(
    createContestDto: ContestDto,
    authorId: number,
  ): Promise<Contest>;
  updateContest(
    contestId: number,
    updateContestDto: ContestDto,
  ): Promise<Contest>;
  deleteContest(contestId: number): Promise<Contest>;

  // questions
  addAndUpdateQuestions(
    contestId: number,
    questions: ContestQuestionDto[],
  ): Promise<Contest>;

  deleteQuestions(contestId: number, questionIds: number[]): Promise<Contest>;
}

@Injectable()
export class ContestService implements IContestService {
  constructor(private prisma: PrismaService) {}

  async createContest(
    createContestDto: ContestDto,
    authorId: number,
  ): Promise<Contest> {
    const author = await this.prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!author) {
      throw new BadRequestException(Message.USER_NOT_FOUND);
    }

    const { isFixTime } = createContestDto;

    if (isFixTime) {
      const { startTime, endTime } = createContestDto;

      if (!startTime || !endTime) {
        throw new BadRequestException(Message.CONTEST_TIME_REQUIRED);
      }

      if (startTime >= endTime) {
        throw new BadRequestException(Message.CONTEST_TIME_INVALID);
      }
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

    const { isFixTime } = updateContestDto;

    if (isFixTime) {
      const { startTime, endTime } = updateContestDto;

      if (!startTime || !endTime) {
        throw new BadRequestException(Message.CONTEST_TIME_REQUIRED);
      }

      if (startTime >= endTime) {
        throw new BadRequestException(Message.CONTEST_TIME_INVALID);
      }
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
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  }

  async getContestForAdmin(id: number): Promise<Contest> {
    const contest = await this.prisma.contest.findUnique({
      where: { id },
      include: {
        author: true,
        questions: {
          include: {
            options: true,
          },
        },
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

  async addAndUpdateQuestions(
    contestId: number,
    questions: ContestQuestionDto[],
  ): Promise<Contest> {
    const contest = await this.getContestForAdmin(contestId);
    let isAddQuestions = false;
    const currentTime = new Date().getTime();
    const startTime = new Date(contest.startTime).getTime();
    const { isFixTime } = contest;

    const contestHasStarted = isFixTime && currentTime > startTime;

    this.validateQuestions(questions);

    // If any question does not have an id, it means it is a new question
    questions.forEach((question) => {
      if (!question.id) {
        isAddQuestions = true;
      }
    });

    if (isAddQuestions && contestHasStarted) {
      throw new BadRequestException(
        Message.QUESTION_CANNOT_BE_ADDED_AFTER_START_TIME,
      );
    }

    const existingQuestions = await this.prisma.question.findMany({
      where: {
        contestId,
      },
      include: {
        options: true,
      },
    });

    this.validateQuestionUpsertStructure(questions, existingQuestions);

    return this.prisma.contest.update({
      where: { id: contestId },
      data: {
        questions: {
          upsert: questions.map((question) => ({
            where: { id: question.id || 0 },
            create: {
              ...question,
              options: {
                create: question.options,
              },
            },
            update: {
              ...question,
              options: {
                upsert: question.options.map((option) => ({
                  where: { id: option.id || 0 },
                  create: option,
                  update: option,
                })),
              },
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

  async deleteQuestions(
    contestId: number,
    questionIds: number[],
  ): Promise<Contest> {
    const contest = await this.prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest) {
      throw new BadRequestException(Message.CONTEST_NOT_FOUND);
    }

    return this.prisma.contest.update({
      where: { id: contestId },
      data: {
        questions: {
          deleteMany: {
            id: {
              in: questionIds,
            },
          },
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

  private validateQuestions(questions: ContestQuestionDto[]) {
    // Check if questions number are unique
    const questionNumbers = questions.map((question) => question.number);
    if (new Set(questionNumbers).size !== questionNumbers.length) {
      throw new BadRequestException(Message.QUESTIONS_NUMBER_INVALID);
    }

    // Check if valid question options
    questions.forEach((question) => {
      // Check if question has at least 2 options
      if (question.options.length < 2) {
        throw new BadRequestException(Message.QUESTION_OPTIONS_INVALID);
      }

      const correctOptions = question.options.filter(
        (option) => option.isCorrect,
      );

      // Check if question has one and only one correct option
      if (correctOptions.length !== 1) {
        throw new BadRequestException(Message.QUESTION_CORRECT_OPTIONS_INVALID);
      }

      // Check if question options' numbers are unique
      const numbers = question.options.map((option) => option.number);
      if (new Set(numbers).size !== numbers.length) {
        throw new BadRequestException(Message.QUESTION_OPTIONS_NUMBER_INVALID);
      }
    });
  }

  private validateQuestionUpsertStructure(
    questions: ContestQuestionDto[],
    existingQuestions: any,
  ) {
    /*
       Check if question structure validate:
       If question id is provided, check if it exists.
       If question options id is provided, check if it exists
    */
    questions.forEach((question) => {
      if (question.id) {
        const existingQuestion = existingQuestions.find(
          (q) => q.id === question.id,
        );

        if (!existingQuestion) {
          throw new BadRequestException(Message.QUESTION_NOT_FOUND);
        }

        question.options.forEach((option) => {
          if (option.id) {
            const existingOption = existingQuestion.options.find(
              (o) => o.id === option.id,
            );

            if (!existingOption) {
              throw new BadRequestException(Message.QUESTION_OPTION_NOT_FOUND);
            }
          }
        });
      }
    });
  }
}
