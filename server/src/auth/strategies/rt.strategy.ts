import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import configuration from '../../config/configuration';
import { UserEntity } from '../../user/user.entity';
import { UserService } from '../../user/user.service';
import { JwtDecoded } from '../interfaces/jwt-decoded.interface';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'refresh-token') {
  constructor(private readonly userService: UserService) {
    const config = configuration();

    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: config.jwtRefresh.secret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtDecoded): Promise<UserEntity> {
    const refreshToken = request.body['refreshToken'];
    const { id } = payload;

    const user = await this.userService.findUserByIdAndRefreshToken(
      id,
      refreshToken,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
