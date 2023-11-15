import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 32)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 32)
  password: string;
}
