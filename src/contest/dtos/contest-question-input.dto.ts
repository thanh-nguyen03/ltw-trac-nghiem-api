import { IsNotEmpty, IsNumber, IsString, Max } from 'class-validator';
import { QuestionOptionDto } from './question-option.dto';

export class ContestQuestionInputDto {
  id: number;

  @IsNumber()
  @IsNotEmpty()
  number: number;

  @IsString()
  @IsNotEmpty()
  @Max(255)
  content: string;

  options: QuestionOptionDto[];
}
