import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class ContestFilter {
  @IsOptional()
  @IsString()
  query: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isFixTime: boolean;
}
