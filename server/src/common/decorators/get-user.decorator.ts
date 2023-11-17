import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';

import { UserEntity } from '../../user/user.entity';

export const GetUser = createParamDecorator(
  (_, context: ExecutionContext): UserEntity => {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  },
);
