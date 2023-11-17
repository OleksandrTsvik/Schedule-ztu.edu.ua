import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findUserById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findUserByUsername(username: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ username });
  }

  async findUserByIdAndRefreshToken(
    id: string,
    refreshToken: string,
  ): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({
      id,
      refreshTokens: { token: refreshToken },
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { username, password } = createUserDto;

    const user = await this.findUserByUsername(username);

    if (user) {
      throw new BadRequestException('Username already exists');
    }

    const newUser = await this.userRepository.create({
      username,
      password,
    });

    await this.userRepository.save(newUser);

    return newUser;
  }
}
