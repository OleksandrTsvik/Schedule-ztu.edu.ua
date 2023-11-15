import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { UserEntity } from '../../auth/user.entity';

export const GetUser = createParamDecorator(
  (_, context: ExecutionContext): UserEntity => {
    const req = context.switchToHttp().getRequest();

    return req.user;
  },
);
