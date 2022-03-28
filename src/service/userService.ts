import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/userCreateDto';
import { UpdateUserDto } from '../dto/userUpdateDto';
import { User } from '../entity/user';
import { UsersRepository } from '../repository/userRepository';

@Injectable()
export class UsersService {
    @Inject()
    usersRepository: UsersRepository;

    create(createUserDto: CreateUserDto): Promise<User> {
        return this.usersRepository.create(createUserDto)
    }

    findAll(): Promise<Array<User>> {
        return this.usersRepository.findAll();
    }

    async findOne(id: string): Promise<User> {
        const user = await this.usersRepository.findOne(id);
        if (!user) {
            throw new NotFoundException(`User with ID=${id} not found`);
        }
        return user;
    }

    update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        return this.usersRepository.update(id, updateUserDto);
    }

    remove(id: string): Promise<User> {
        return this.usersRepository.remove(id);
    }
}
