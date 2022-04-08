import { Inject, Injectable } from "@nestjs/common";
import { CreateUserDto } from "../dto/userCreateDto";
import { UpdateUserDto } from "../dto/userUpdateDto";
import { User } from "../entity/user";
import { UserRepository } from "../repository/userRepository";
import {logger} from "../../logger";
import {ICriteriaRef} from "../../events/interface/criteriaRefInterface";
import {CriteriaRepository} from "../../events/repository/criteriaRepository";

@Injectable()
export class UsersService {
  @Inject()
  usersRepository: UserRepository;

  @Inject()
  criteriaRepository: CriteriaRepository;

  async addCriteria(eventId: number, criteriaRef: ICriteriaRef) {
      const criteria = await this.criteriaRepository.findOneById(criteriaRef.id)
      const user = await this.usersRepository.findOne(eventId)
      user.criteria.push(criteria)
      return this.usersRepository.addCriteria(user)
  }


  create(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.create(createUserDto);
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.findAll();
    return users;
  }

  async findOne(id: number): Promise<User> {
    let user;
   try{
     user = await this.usersRepository.findOne(id);
   }
    catch(error) {
      logger.error(`User with ID=${id} not found`+ error);
    }
    // let score: number[] = [];
    // let i;
    // user.events.map(event => event.criteria.map(criteria => {i=0,
    //       criteria.subCriteria.map(subCriteria => subCriteria.state ? i++ : ''), score.push(i)
    //   }))
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: number): Promise<User> {
    return this.usersRepository.remove(id);
  }
}
