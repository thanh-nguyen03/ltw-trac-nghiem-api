import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDefaultDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;
}
