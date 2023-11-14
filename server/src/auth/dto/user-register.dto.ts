import { IsNotEmpty, IsString, Length } from 'class-validator';

import { Match } from '../../common/decorators/match.decorator';

export class UserRegisterDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 32)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 32)
  password: string;

  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}
