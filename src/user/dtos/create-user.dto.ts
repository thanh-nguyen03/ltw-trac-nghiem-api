import { IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Min(6)
  password: string;
}
