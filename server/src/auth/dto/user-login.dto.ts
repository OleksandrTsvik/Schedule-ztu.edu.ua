import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  @Length(1, 32)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 32)
  password: string;
}
