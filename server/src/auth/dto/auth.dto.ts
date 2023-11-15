import { UserEntity } from '../user.entity';

export class AuthDto {
  user: UserEntity;
  accessToken: string;
}
