import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/userCreateDto';
import { UpdateUserDto } from '../dto/userUpdateDto';
import { User, UserDto } from '../entity/user';
import { logger } from '../../logger';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from '../../cloudinary/cloudinaryService';
import { dbAuth } from '../auth/preauthMiddleware';
import { NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository/userRepository';
import { UserSalaryDto } from '../dto/userSalaryDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private cloudinary: CloudinaryService,
  ) {}

  @Inject()
  usersRepository: UserRepository

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const auth = await dbAuth.createUser({
        email: createUserDto.email,
        password: createUserDto.password,
      })
      createUserDto.authUid = auth.uid
      createUserDto.avatar = process.env.AVATAR_URL
      return await this.usersRepository.create(createUserDto)
    } catch (err) {
      throw new BadRequestException(`Method Not Allowed`)
    }
  }

  async findAll(
    limit: number = 10,
    page: number = 0
  ): Promise<{ data: User[]; count: number }> {
    if (limit > 100) {
      throw {
        statusCode: 400,
        message: 'Pagination limit exceeded'
      };
    }
    return this.usersRepository.findAll(limit, page);
  }

  async findOneById(id: number): Promise<User> {
    let user
    try {
      user = await this.usersRepository.findOneById(id)
    } catch (error) {
      logger.error(`User with ID=${id} not found ${error}`)
    }
    return user
  }

  async findOne(authUid: string): Promise<User> {
    let user
    try {
      user = await this.usersRepository.findOne(authUid)
    } catch (error) {
      logger.error(`User with ID=${authUid} not found ${error}`)
    }
    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.update(id, updateUserDto)
    if (!user) {
      throw new NotFoundException(`User with ID=${id} not found`)
    }
    return user
  }

  async remove(id: number): Promise<User> {
    try {
      return await this.usersRepository.remove(id);
    } catch (err) {
      throw {
        statusCode: 404,
        message: `User with ID=${id} not found`
      };
    }
  }

  async changeSalary(id: number, userSalaryDto: UserSalaryDto): Promise<User> {
    try {
      return this.usersRepository.changeSalary(id, userSalaryDto);
    } catch (err) {
      throw new NotFoundException(`User with ID=${id} not found`);
    }
  }

  async uploadImageToCloudinary(file: Express.Multer.File, uid: string) {
    try {
      const user = await this.usersRepository.findOne(uid)
      if (user.avatarPublicId) {
        await this.cloudinary.deleteImg(user.avatarPublicId)
      }
      const cloudinaryRes = await this.cloudinary.uploadImage(file)
      return this.usersRepository.uploadImage(
        uid,
        cloudinaryRes.public_id,
        cloudinaryRes.url,
        user.id,
      )
    } catch (err) {
      throw new NotFoundException(`file is not found`)
    }
  }

  async userDeactivate(id: number) {
    try {
      const user = await this.usersRepository.findOneById(id);
      const authUser = await dbAuth.getUser(user.authUid);
      if (authUser.disabled) {
        await dbAuth.updateUser(user.authUid, {
          disabled: false
        });
      } else {
        await dbAuth.updateUser(user.authUid, {
          disabled: true
        });
      }
    } catch (err) {
      throw new NotFoundException(`User with ID=${id} not found`);
    }
  }
}
