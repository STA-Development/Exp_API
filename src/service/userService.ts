import {Inject, Injectable, NotFoundException,BadRequestException} from '@nestjs/common';
import {CreateUserDto} from '../dto/userCreateDto';
import {UpdateUserDto} from '../dto/userUpdateDto';
import {User} from '../entity/user';
import {UsersRepository} from '../repository/userRepository';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import { CloudinaryService } from '../cloudinary/cloudinaryService';
@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(User) private readonly userRepository: Repository<User>,
      private cloudinary: CloudinaryService
  ) {}

  @Inject()
  usersRepository: UsersRepository;
   async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersRepository.create(createUserDto);
    } catch (err) {
      console.log({ message: 404 });
    }
  }

  findAll(): Promise<Array<User>> {
    return this.usersRepository.findAll();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID=${id} not found`);
    }
    return user;
  }

  async findOneEmail(condition: string): Promise<User> {
    return this.userRepository.findOne({
      where: [
        { email: condition}
      ],});
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: number): Promise<User> {
    return this.usersRepository.remove(id);
  }

  async resetFindeOne(condition: number,pass:string): Promise<User> {
    const user = await this.userRepository.preload({
      id: condition,
      password:pass
    });
  return this.userRepository.save(user);

  }

  async changeSalary(userId: number,salary:number,id:number): Promise<User> {
    const user = await this.usersRepository.findOne(userId);
    if(user.isAdmin){
      const changeSal = await this.userRepository.preload({
      id:id,
       salary:salary
    });
    return this.userRepository.save(changeSal);
    }
  }

  async uploadImageToCloudinary(file: Express.Multer.File,condition: number) {
    const userId = await this.usersRepository.findOne(condition);
    if(userId.avatar_public_id){
     await this.cloudinary.deleteImg(userId.avatar_public_id);
    }
   const cloudinaryRes =await this.cloudinary.uploadImage(file);
    const user = await this.userRepository.preload({
      id: condition,
      avatar:cloudinaryRes.url,
      avatar_public_id:cloudinaryRes.public_id
    });
    return this.userRepository.save(user);
  }
}
