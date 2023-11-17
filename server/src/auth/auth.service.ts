import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';

import { OFFSET_TO_UPDATE_REFRESH_TOKEN } from '../common/constants/constants';
import isExpiredToken from '../common/utils/is-expired-token.util';
import configuration from '../config/configuration';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Tokens } from './interfaces/tokens.interface';
import { RefreshTokens } from './interfaces/refresh-tokens.interface';
import { JwtDecoded } from './interfaces/jwt-decoded.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async register(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const { username, password } = userRegisterDto;
    const hashedPassword = await hash(password, 10);

    const newUser = await this.userService.createUser({
      username,
      password: hashedPassword,
    });

    return newUser;
  }

  async login(userLoginDto: UserLoginDto): Promise<AuthDto> {
    const { username, password } = userLoginDto;
    const user = await this.userService.findUserByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Incorrect username or password');
    }

    const passwordMatches = await compare(password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Incorrect username or password');
    }

    await this.refreshTokenService.deleteExpiredAndRevokedTokensForUser(user);

    const tokens: Tokens = {
      accessToken: await this.generateAccessToken(user),
      refreshToken: await this.generateAndSaveRefreshToken(user),
    };

    return { user, ...tokens };
  }

  async logout(
    user: UserEntity,
    refreshTokenDto: RefreshTokenDto,
  ): Promise<void> {
    const { refreshToken } = refreshTokenDto;
    await this.refreshTokenService.deleteRefreshToken(user, refreshToken);
  }

  async refreshToken(
    user: UserEntity,
    refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokens> {
    const { refreshToken } = refreshTokenDto;

    const refreshTokenEntity =
      await this.refreshTokenService.findRefreshTokenByToken(
        user,
        refreshToken,
      );

    if (!refreshTokenEntity || refreshTokenEntity.revoked) {
      throw new UnauthorizedException();
    }

    const refreshTokens: RefreshTokens = {
      accessToken: await this.generateAccessToken(user),
    };

    // if the refreshToken expires in OFFSET_TO_UPDATE_REFRESH_TOKEN seconds,
    // delete it and create a new one
    if (
      isExpiredToken(refreshTokenEntity.expires, OFFSET_TO_UPDATE_REFRESH_TOKEN)
    ) {
      await this.refreshTokenService.deleteRefreshToken(
        user,
        refreshTokenEntity.token,
      );

      refreshTokens.refreshToken = await this.generateAndSaveRefreshToken(user);
    }

    return refreshTokens;
  }

  async generateAccessToken(user: UserEntity): Promise<string> {
    const config = configuration();
    const payload = this.getJwtPayload(user);

    return this.jwtService.signAsync(payload, {
      secret: config.jwtAccess.secret,
      expiresIn: config.jwtAccess.expiresIn,
    });
  }

  async generateRefreshToken(user: UserEntity): Promise<string> {
    const config = configuration();
    const payload = this.getJwtPayload(user);

    return this.jwtService.signAsync(payload, {
      secret: config.jwtRefresh.secret,
      expiresIn: config.jwtRefresh.expiresIn,
    });
  }

  async generateAndSaveRefreshToken(user: UserEntity): Promise<string> {
    const refreshToken = await this.generateRefreshToken(user);
    const decodedToken = this.jwtService.decode<JwtDecoded>(refreshToken);

    await this.refreshTokenService.createRefreshToken(
      user,
      refreshToken,
      decodedToken.exp,
    );

    return refreshToken;
  }

  getJwtPayload(user: UserEntity): JwtPayload {
    return {
      id: user.id,
      username: user.username,
    };
  }
}
