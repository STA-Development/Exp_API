import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UserGetDto } from "../dto/userGetDto";
import { CreateUserDto } from "../dto/userCreateDto";
import { UpdateUserDto } from "../dto/userUpdateDto";
import { User } from "../entity/user";
import { UserRepository } from "../repository/userRepository";

@Injectable()
export class UsersService {
  @Inject()
  usersRepository: UserRepository;

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.create(createUserDto);
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.findAll();

    return users.map((user) => UserGetDto(user));
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID=${id} not found`);
    }
    return UserGetDto(user);
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: number): Promise<User> {
    return this.usersRepository.remove(id);
  }
}
