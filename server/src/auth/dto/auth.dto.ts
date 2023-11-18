import { UserEntity } from '../../user/user.entity';

export class AuthDto {
  user: UserEntity;
  accessToken: string;
  refreshToken?: string;
}
