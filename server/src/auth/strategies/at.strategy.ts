import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import configuration from '../../config/configuration';
import { UserEntity } from '../../user/user.entity';
import { UserService } from '../../user/user.service';
import { JwtDecoded } from '../interfaces/jwt-decoded.interface';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'access-token') {
  constructor(private readonly userService: UserService) {
    const config = configuration();

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwtAccess.secret,
    });
  }

  async validate(payload: JwtDecoded): Promise<UserEntity> {
    const { id } = payload;
    const user = await this.userService.findUserById(id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
