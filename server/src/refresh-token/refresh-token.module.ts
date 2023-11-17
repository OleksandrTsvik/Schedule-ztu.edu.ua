import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenEntity } from './refresh-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshTokenEntity])],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
