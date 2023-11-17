import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { GetUser } from '../common/decorators/get-user.decorator';
import { UserEntity } from '../user/user.entity';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthDto } from './dto/auth.dto';
import { AtGuard } from './guards/at.guard';
import { RtGuard } from './guards/rt.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    return this.authService.register(userRegisterDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() userLoginDto: UserLoginDto): Promise<AuthDto> {
    return this.authService.login(userLoginDto);
  }

  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(
    @GetUser() user: UserEntity,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    return this.authService.logout(user, refreshTokenDto);
  }

  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  @Put('refreshToken')
  refreshToken(
    @GetUser() user: UserEntity,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    return this.authService.refreshToken(user, refreshTokenDto);
  }
}
