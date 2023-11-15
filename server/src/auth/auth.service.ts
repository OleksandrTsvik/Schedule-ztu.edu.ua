import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';

import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthDto } from './dto/auth.dto';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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

    const payload = this.getJwtPayload(user);
    const accessToken = await this.jwtService.signAsync(payload);

    return { user, accessToken };
  }

  getJwtPayload(user: UserEntity): JwtPayload {
    return {
      id: user.id,
      username: user.username,
    };
  }
}
