import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/userCreateDto';
import { UpdateUserDto } from '../dto/userUpdateDto';
import { User, UserPivot } from '../entity/user';
import { logger } from '../../logger';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from '../../cloudinary/cloudinaryService';
import { dbAuth } from '../auth/preauthMiddleware';
import { NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository/userRepository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private cloudinary: CloudinaryService
  ) {}

  @Inject()
  usersRepository: UserRepository;

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const auth = await dbAuth.createUser({
        email: createUserDto.email,
        password: createUserDto.password
      });
      createUserDto.authUid = auth.uid;
      createUserDto.avatar = process.env.AVATAR_URL;
      return await this.usersRepository.create(createUserDto);
    } catch (err) {
      throw new BadRequestException(`Method Not Allowed`);
    }
  }

  async findAll(): Promise<UserPivot[]> {
    return await this.usersRepository.findAll();
  }

  async findOneById(id: number): Promise<User> {
    let user;
    try {
      user = await this.usersRepository.findOneById(id);
    } catch (error) {
      logger.error(`User with ID=${id} not found` + error);
    }
    return user;
  }

  async findOne(authUid: string): Promise<User> {
    return this.usersRepository.findOne(authUid);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException(`User with ID=${id} not found`);
    }
    return user;
  }

  async remove(id: number): Promise<User> {
    try {
      return await this.usersRepository.remove(id);
    } catch (err) {
      throw {
        statusCode: 404,
        message: 'Not Found'
      };
    }
  }

  async changeSalary(salary: number, id: number): Promise<User> {
    try {
      return this.usersRepository.changeSalary(id, salary);
    } catch (err) {
      throw new NotFoundException(`User with ID=${id} not found`);
    }
  }

  async uploadImageToCloudinary(file: Express.Multer.File, uid: string) {
    try {
      const user = await this.usersRepository.findOne(uid);
      if (user.avatarPublicId) {
        await this.cloudinary.deleteImg(user.avatarPublicId);
      }
      const cloudinaryRes = await this.cloudinary.uploadImage(file);
      return this.usersRepository.uploadImage(
        uid,
        cloudinaryRes.public_id,
        cloudinaryRes.url,
        user.id
      );
    } catch (err) {
      throw new NotFoundException(`file is not found`);
    }
  }
}
