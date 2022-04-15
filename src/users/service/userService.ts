import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/userCreateDto';
import { UpdateUserDto } from '../dto/userUpdateDto';
import { User } from '../entity/user';
import { UserRepository } from '../repository/userRepository';
import { logger } from '../../logger';

@Injectable()
export class UsersService {
  @Inject()
  usersRepository: UserRepository;

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.findAll();
    return users;
  }

  async findOne(id: number): Promise<User> {
    let user;
    try {
      user = await this.usersRepository.findOne(id);
    } catch (error) {
      logger.error(`User with ID=${id} not found` + error);
    }
    return user;
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.create(createUserDto);
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: number): Promise<User> {
    return this.usersRepository.remove(id);
  }
}
