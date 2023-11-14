import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';

import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async register(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const { username, password } = userRegisterDto;

    const user = await this.findUserByUsername(username);

    if (user) {
      throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await this.userRepository.create({
      username,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);

    return newUser;
  }

  async login(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const { username, password } = userLoginDto;

    const user = await this.findUserByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Incorrect username or password');
    }

    const passwordMatches = await compare(password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Incorrect username or password');
    }

    return user;
  }

  async findUserByUsername(username: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ username });
  }
}
