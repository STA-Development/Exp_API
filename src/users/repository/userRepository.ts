import {Injectable, NotFoundException} from "@nestjs/common";
import {CreateUserDto} from "../dto/userCreateDto";
import {UpdateUserDto} from "../dto/userUpdateDto";
import {User} from "../entity/user";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { dbAuth } from "../auth/preauthMiddleware";
@Injectable()
export class UserRepository {
  @InjectRepository(User)
  userRepository: Repository<User>;

   create(createUserDto: CreateUserDto): Promise<User> {
    const user =  this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find({relations: ["events"],});
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne( {relations: ["events"], where:{authUid: id }});
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto
    });
    return this.userRepository.save(user);
  }

  async remove(id: number,data:string): Promise<User> {
    const user = await this.findOne(data);
    const removeUserId = await this.userRepository.findOne(id)
    if(user.isAdmin){
      await dbAuth.deleteUser(removeUserId.authUid);
    return this.userRepository.remove(removeUserId);}
  }
}
