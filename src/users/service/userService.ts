import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/userCreateDto';
import { UpdateUserDto } from '../dto/userUpdateDto';
import { User, UserPivot } from '../entity/user';
import { UserRepository } from '../repository/userRepository';
import { logger } from '../../logger';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from '../../cloudinary/cloudinaryService';
import { NotFoundException } from '@nestjs/common';
import { userGetDto } from '../dto/userGetDto';

@Injectable()
export class UsersService {
  constructor(private cloudinary: CloudinaryService) {}

  @InjectRepository(User)
  usersRepository: Repository<User>;

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.create(createUserDto);
    if (!user) {
      throw new NotFoundException(`how have wrong schema`);
    }
    return user;
  }

  async findAll(): Promise<UserPivot[]> {
    return await this.usersRepository.find();
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

  findOneEmail(condition: string): Promise<User> {
    return this.usersRepository.findOne({
      where: [{ email: condition }]
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto
  ): Promise<UpdateResult> {
    //TODO updating in service, not in repository
    const user = await this.usersRepository.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException(`User with ID=${id} not found`);
    }
    return user;
  }

  async remove(id: number) {
    //TODO return type
    // TODO test
    // if (!user) {
    //   throw new NotFoundException(`User with ID=${id} not found`);
    // }
    return this.usersRepository.remove(await this.usersRepository.findOne(id));
  }

  async resetFindeOne(id: number, pass: string): Promise<User> {
    const user = await this.usersRepository.update(id, {
      password: pass
    });
    if (!user) {
      throw new NotFoundException(`User with ID=${id} not found`);
    }
    return this.usersRepository.save(await this.usersRepository.findOne(id));
  }

  async changeSalary(
    userId: number,
    salary: number,
    id: number
  ): Promise<User> {
    const user = await this.usersRepository.findOne(userId);
    if (user.isAdmin) {
      const changeSal = await this.usersRepository.preload({
        id: id,
        salary: salary
      });
      if (!changeSal) {
        throw new NotFoundException(
          `User with ID=${userId} not found or not admin`
        );
      }
      return this.usersRepository.save(changeSal);
    }
  }

  async uploadImageToCloudinary(file: Express.Multer.File, id: number) {
    const userId = await this.usersRepository.findOne(id);
    if (userId.avatarPublicId) {
      await this.cloudinary.deleteImg(userId.avatarPublicId);
    }
    const cloudinaryRes = await this.cloudinary.uploadImage(file);
    const user = await this.usersRepository.preload({
      id: id,
      avatar: cloudinaryRes.url,
      avatarPublicId: cloudinaryRes.public_id
    });
    return this.usersRepository.save(user);
  }
}
