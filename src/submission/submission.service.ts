import { PrismaService } from '../prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubmissionDto } from './dtos/create-submission.dto';
import { Submission } from '@prisma/client';
import { Message } from '../common/constants/message';

interface ISubmissionService {
  createSubmission(
    contestId: number,
    userId: number,
    createSubmissionDto: CreateSubmissionDto,
  ): Promise<Submission>;
}

@Injectable()
export class SubmissionService implements ISubmissionService {
  constructor(private prisma: PrismaService) {}

  async createSubmission(
    contestId: number,
    userId: number,
    createSubmissionDto: CreateSubmissionDto,
  ): Promise<Submission> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(Message.USER_NOT_FOUND);
    }

    const submission = await this.prisma.submission.create({
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
        answers: {
          create: createSubmissionDto.answers,
        },
        totalTime: createSubmissionDto.totalTime,
      },
    });

    // judge the submission
    return this.judgeSubmission(submission);
  }

  private async judgeSubmission(submission: Submission): Promise<Submission> {
    // get all the answers of the submission
    const answers = await this.prisma.submissionAnswer.findMany({
      where: {
        submissionId: submission.id,
      },
    });

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
}
