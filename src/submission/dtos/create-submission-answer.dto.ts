import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSubmissionAnswerDto {
  @IsNumber()
  @IsNotEmpty()
  questionId: number;

  @IsNumber()
  @IsNotEmpty()
  optionId: number;
}
