import { PrismaService } from '../prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubmissionDto } from './dtos/create-submission.dto';
import { Submission } from '@prisma/client';
import { Message } from '../common/constants/message';

interface ISubmissionService {
  createSubmission(contestId: number, userId: number): Promise<Submission>;
  judgeSubmission(
    submissionId: number,
    createSubmissionDto: CreateSubmissionDto,
  ): Promise<Submission>;
  findAll(): Promise<Submission[]>;
  findAllSubmissionByContest(contestId: number): Promise<Submission[]>;
  findAllByUser(userId: number): Promise<Submission[]>;
  findAllByUserAndContest(
    contestId: number,
    userId: number,
  ): Promise<Submission[]>;
  getSubmissionResult(submissionId: number): Promise<Submission>;
  adminGetSubmission(submissionId: number): Promise<Submission>;
}

@Injectable()
export class SubmissionService implements ISubmissionService {
  constructor(private prisma: PrismaService) {}

  async createSubmission(
    contestId: number,
    userId: number,
  ): Promise<Submission> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(Message.USER_NOT_FOUND);
    }

    const contest = await this.prisma.contest.findUnique({
      where: {
        id: contestId,
      },
    });

    if (!contest) {
      throw new NotFoundException(Message.CONTEST_NOT_FOUND);
    }

    const { isFixTime } = contest;

    if (isFixTime) {
      // if the contest is a fix time contest, check if the contest is still running
      const currentTime = new Date().getTime();
      const startTime = new Date(contest.startTime).getTime();
      const endTime = new Date(contest.endTime).getTime();

      if (currentTime < startTime) {
        throw new BadRequestException(Message.CONTEST_NOT_STARTED);
      }

      if (currentTime > endTime) {
        throw new BadRequestException(Message.CONTEST_ENDED);
      }
    }

    return this.prisma.submission.create({
      data: {
        score: null,
        contest: {
          connect: {
            id: contestId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async judgeSubmission(
    submissionId: number,
    createSubmissionDto: CreateSubmissionDto,
  ): Promise<Submission> {
    const { answers, totalTime } = createSubmissionDto;

    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        contest: true,
      },
    });

    if (!submission) {
      throw new NotFoundException(Message.USER_DID_NOT_START_CONTEST);
    }

    const { contest } = submission;

    const { isFixTime } = contest;

    if (isFixTime) {
      // if the contest is a fix time contest, check if the contest is still running
      const currentTime = new Date().getTime();
      const startTime = new Date(contest.startTime).getTime();
      const endTime = new Date(contest.endTime).getTime();

      if (currentTime < startTime) {
        throw new BadRequestException(Message.CONTEST_NOT_STARTED);
      }

      if (currentTime > endTime) {
        throw new BadRequestException(Message.CONTEST_ENDED);
      }
    }

    // calculate the total score of the submission based on the answers compare to question option isCorrect field
    let totalScore = 0;
    for (const answer of answers) {
      const questionOption = await this.prisma.questionOption.findUnique({
        where: {
          id: answer.optionId,
        },
      });

      if (questionOption.isCorrect) {
        totalScore += 1;
      }
    }

    // update the submission with the total score
    return this.prisma.submission.update({
      where: {
        id: submission.id,
      },
      data: {
        score: totalScore,
        answers: {
          createMany: {
            data: answers.map((answer) => ({
              questionId: answer.questionId,
              optionId: answer.optionId,
            })),
          },
        },
        totalTime,
      },
      include: {
        answers: {
          select: {
            id: true,
            questionId: true,
            optionId: true,
          },
        },
        user: true,
        contest: {
          select: {
            // All fields except for authorId
            id: true,
            name: true,
            description: true,
            isFixTime: true,
            startTime: true,
            endTime: true,
            createdAt: true,
            updatedAt: true,
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });
  }

  findAllSubmissionByContest(contestId: number): Promise<Submission[]> {
    return this.prisma.submission.findMany({
      where: {
        contestId,
      },
    });
  }

  findAll(): Promise<Submission[]> {
    return this.prisma.submission.findMany();
  }

  findAllByUser(userId: number): Promise<Submission[]> {
    return this.prisma.submission.findMany({
      where: {
        userId,
      },
      include: {
        contest: true,
      },
    });
  }

  async adminGetSubmission(submissionId: number): Promise<Submission> {
    return this.prisma.submission.findUnique({
      where: {
        id: submissionId,
      },
      include: {
        answers: {
          select: {
            id: true,
            questionId: true,
            optionId: true,
          },
        },
        user: true,
        contest: {
          include: {
            author: true,
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });
  }

  async findAllByUserAndContest(
    contestId: number,
    userId: number,
  ): Promise<Submission[]> {
    return this.prisma.submission.findMany({
      where: {
        AND: {
          userId,
          contestId,
        },
      },
    });
  }

  async getSubmissionResult(submissionId: number): Promise<Submission> {
    const submission = await this.prisma.submission.findUnique({
      where: {
        id: submissionId,
      },
      include: {
        answers: true,
        contest: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    if (!submission) {
      throw new NotFoundException(Message.SUBMISSION_NOT_FOUND);
    }

    // Only return the submission relations if the submission is completed (score != null)
    if (submission.score === null) {
      delete submission.contest.questions;
    }

    return submission;
  }
}
