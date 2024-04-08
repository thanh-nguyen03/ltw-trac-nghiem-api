import { IsOptional, IsString } from 'class-validator';

export class UserFilter {
  @IsOptional()
  @IsString()
  query: string;
}
