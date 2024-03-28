import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
} from 'class-validator';

export class QuestionOptionDto {
  id: number;

  @IsNumber()
  @IsNotEmpty()
  number: number;

  @IsString()
  @IsNotEmpty()
  @Max(255)
  content: string;

  @IsBoolean()
  isCorrect: boolean;

  @IsNumber()
  @IsNotEmpty()
  questionId: number;
}
