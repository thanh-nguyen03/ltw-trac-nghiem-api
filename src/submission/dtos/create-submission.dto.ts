import { CreateSubmissionAnswerDto } from './create-submission-answer.dto';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

export class CreateSubmissionDto {
  @IsArray()
  @ValidateNested({ each: true })
  answers: CreateSubmissionAnswerDto[];

  @IsNumber()
  @IsNotEmpty()
  totalTime: number;
}
