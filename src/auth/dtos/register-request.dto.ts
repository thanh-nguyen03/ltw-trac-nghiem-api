import { IsNotEmpty, IsString, Min } from 'class-validator';

export class RegisterRequestDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @Min(6)
  password: string;
}
