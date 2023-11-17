import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { RefreshTokenEntity } from './refresh-token.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  async findRefreshTokenByToken(
    user: UserEntity,
    token: string,
  ): Promise<RefreshTokenEntity | null> {
    return this.refreshTokenRepository.findOneBy({
      user: { id: user.id },
      token,
    });
  }

  async findRefreshTokenByTokenOrFail(
    user: UserEntity,
    token: string,
  ): Promise<RefreshTokenEntity> {
    const refreshToken = await this.refreshTokenRepository.findOneBy({
      user: { id: user.id },
      token,
    });

    if (!refreshToken) {
      throw new NotFoundException('No refresh token');
    }

    return refreshToken;
  }

  async createRefreshToken(
    user: UserEntity,
    token: string,
    expires: number,
  ): Promise<RefreshTokenEntity> {
    const newRefreshToken = await this.refreshTokenRepository.create({
      token,
      expires,
      user,
    });

    await this.refreshTokenRepository.save(newRefreshToken);

    return newRefreshToken;
  }

  async deleteRefreshToken(user: UserEntity, token: string): Promise<void> {
    await this.refreshTokenRepository.delete({ user: { id: user.id }, token });
  }

  async deleteExpiredAndRevokedTokensForUser(user: UserEntity): Promise<void> {
    const currentTime = new Date().getTime() / 1000;

    await this.refreshTokenRepository
      .createQueryBuilder('refresh_tokens')
      .innerJoin('refresh_tokens.user', 'user')
      .delete()
      .where('user.id = :userId', { userId: user.id })
      .andWhere('expires < :currentTime OR revoked is not null', {
        currentTime,
      })
      .execute();

    // await this.refreshTokenRepository.delete({
    //   user: { id: user.id },
    //   expires: MoreThan(currentTime),
    //   revoked: Not(IsNull()),
    // });
  }
}
