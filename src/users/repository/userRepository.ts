import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/userCreateDto';
import { UpdateUserDto } from '../dto/userUpdateDto';
import { User } from '../entity/user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { dbAuth } from '../auth/preauthMiddleware';
import { UserSalaryDto } from '../dto/userSalaryDto';
import { AddUserDto } from '../dto/addUserDto';

@Injectable()
export class UserRepository {
  @InjectRepository(User)
  userRepository: Repository<User>;

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(
    limit: number,
    page: number
  ): Promise<{ data: User[]; count: number }> {
    const builder = this.userRepository.createQueryBuilder('user');
    const total = await builder.getCount();
    const pages = Math.ceil(total / limit);
    const data = await this.userRepository.find({
      relations: ['pivot', 'pivot.event'],
      take: limit,
      skip: (page - 1) * limit
    });
    return { data, count: pages };
  }

  findOneById(id: number): Promise<User> {
    return this.userRepository.findOne({
      relations: ['pivot', 'pivot.event'],
      where: { id }
    });
  }

  findOne(uid: string): Promise<User> {
    return this.userRepository.findOne({
      relations: ['pivot', 'pivot.event'],
      where: { authUid: uid }
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto
    });
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<User> {
    const removeUserId = await this.userRepository.findOne(id);
    return this.userRepository.remove(removeUserId);
  }

  async changeSalary(id: number, userSalaryDto: UserSalaryDto): Promise<User> {
    const user = await this.userRepository.preload({
      id: id,
      salary: userSalaryDto.salary
    });
    return this.userRepository.save(user);
  }

  async uploadImage(
    uid: string,
    public_id: string,
    url: string,
    id: number
  ): Promise<User> {
    const user = await this.userRepository.preload({
      id: id,
      avatar: url,
      avatarPublicId: public_id
    });
    return this.userRepository.save(user);
  }

  async addUser(addUserDto: AddUserDto): Promise<User> {
    const user = await this.userRepository.create(addUserDto);
    return this.userRepository.save(user);
  }
}
