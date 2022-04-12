import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { CreateUserDto } from '../dto/userCreateDto';
import { UpdateUserDto } from '../dto/userUpdateDto';
import { User } from '../entity/user';
import { UserRepository } from '../repository/userRepository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from '../../cloudinary/cloudinaryService';
import { dbAuth } from '../auth/preauthMiddleware';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private cloudinary: CloudinaryService
  ) {}

  @Inject()
  usersRepository: UserRepository;
  async create(createUserDto: CreateUserDto): Promise<User> {
    const auth = await dbAuth.createUser({
      email: createUserDto.email,
      password: createUserDto.password
    });
    createUserDto.authUid = auth.uid;
    createUserDto.avatar = process.env.AVATAR_URL;
    const user = await this.usersRepository.create(createUserDto);
    if (!user) {
      throw new NotFoundException(`you have wrong schema`);
    }
    return user;
  }

  findAll(): Promise<Array<User>> {
    return this.usersRepository.findAll();
  }

  async findOne(authUid: string): Promise<User> {
    const user = await this.usersRepository.findOne(authUid);
    if (!user) {
      throw new NotFoundException(`User with ID=${authUid} not found`);
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = this.usersRepository.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException(`User with ID=${id} not found`);
    }
    return user;
  }

  async remove(id: number, uid: string): Promise<User> {
    const user = await this.usersRepository.remove(id, uid);
    if (!user) {
      throw new NotFoundException(`User with ID=${id} not found`);
    }
    return user;
  }

  async changeSalary(
    userId: string,
    salary: number,
    id: number
  ): Promise<User> {
    const user = await this.usersRepository.findOne(userId);
    if (user.isAdmin) {
      const changeSal = await this.userRepository.preload({
        id: id,
        salary: salary
      });
      if (!changeSal) {
        throw new NotFoundException(
          `User with ID=${userId} not found or not admin`
        );
      }
      return this.userRepository.save(changeSal);
    }
  }

  async uploadImageToCloudinary(file: Express.Multer.File, id: string) {
    const userId = await this.usersRepository.findOne(id);
    if (userId.avatarPublicId) {
      await this.cloudinary.deleteImg(userId.avatarPublicId);
    }
    const cloudinaryRes = await this.cloudinary.uploadImage(file);
    const user = await this.userRepository.preload({
      id: userId.id,
      avatar: cloudinaryRes.url,
      avatarPublicId: cloudinaryRes.public_id
    });
    return this.userRepository.save(user);
  }
}
