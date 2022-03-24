import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {CreateUserDto} from '../dto/userCreateDto';
import {UpdateUserDto} from '../dto/userUpdateDto';
import {User} from '../entity/user';
import {UsersRepository} from '../repository/userRepository';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {
  }
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


  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID=${id} not found`);
    }
    return user;
  }

  async findOneEmail(condition: string): Promise<User> {
    console.log('hiiii');
    console.log(condition)
    return this.userRepository.findOne({
      where: [
        { email: condition}


      ],});
  }




  update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: string): Promise<User> {
    return this.usersRepository.remove(id);

  }

  async resetFindeOne(condition: string,pass:string): Promise<User> {
    console.log('hiiii');
    console.log(condition)
    const user = await this.userRepository.preload({
      id: condition,
      password:pass
    });
  return this.userRepository.save(user);

  }





}
