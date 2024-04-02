import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class QuestionOptionDto {
  id: number;

  @IsNumber()
  @IsNotEmpty()
  number: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  content: string;

  @IsBoolean()
  isCorrect: boolean;
}
