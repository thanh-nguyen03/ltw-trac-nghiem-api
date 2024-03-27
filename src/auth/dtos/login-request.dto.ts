import { IsNotEmpty, IsString, Min } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Min(6)
  password: string;
}
