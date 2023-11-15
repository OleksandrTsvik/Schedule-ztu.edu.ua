import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() userRegisterDto: UserRegisterDto,
  ): Promise<UserEntity> {
    return this.authService.register(userRegisterDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto): Promise<AuthDto> {
    return this.authService.login(userLoginDto);
  }
}
