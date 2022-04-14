import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "../dto/userCreateDto";
import { UpdateUserDto } from "../dto/userUpdateDto";
import { User } from "../entity/user";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository {
  @InjectRepository(User)
  userRepository: Repository<User>;

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ["pivot", "pivot.event"] });
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOne(id, {
      relations: ["pivot", "pivot.event"],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.preload({
      ...updateUserDto,
    });
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }
}
