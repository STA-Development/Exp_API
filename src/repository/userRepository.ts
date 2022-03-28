import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/userCreateDto';
import { UpdateUserDto } from '../dto/userUpdateDto';
import { User } from '../entity/user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
    @InjectRepository(User)
    userRepository: Repository<User>;

    create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.userRepository.create(createUserDto);
        return this.userRepository.save(user);
    }

    findAll(): Promise<Array<User>> {
        return this.userRepository.find();
    }

    async findOne(id: string): Promise<User> {                   /// | Error petqa?
        const user = await this.userRepository.findOne(id);
        if (!user) {
            throw new NotFoundException(`User with ID=${id} not found`);
        }
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User>  {
        const user = await this.userRepository.preload({
            id: id,
            ...updateUserDto,
        });
        if (!user) {
            throw new NotFoundException(`User with ID=${id} not found`);
        }
        return this.userRepository.save(user);
    }

    async remove(id: string): Promise<User> {
        const user = await this.findOne(id);
        return this.userRepository.remove(user);
    }
}
