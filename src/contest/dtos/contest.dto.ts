import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
} from 'class-validator';
export class ContestDto {
  @IsString()
  @IsNotEmpty()
  @Max(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Max(2000)
  description: string;

  @IsBoolean()
  isFixTime: boolean;

  @IsDate()
  @IsOptional()
  startTime?: Date;

  @IsInt()
  @IsNotEmpty()
  authorId: number;
}
