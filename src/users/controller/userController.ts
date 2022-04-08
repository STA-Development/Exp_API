import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Inject,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import { UsersService } from "../service/userService";
import { CreateUserDto } from "../dto/userCreateDto";
import { UpdateUserDto } from "../dto/userUpdateDto";
import { User } from "../entity/user";
import {logger} from "../../logger";
import {userGetDto} from "../dto/userGetDto";
import {idRefDto} from "../../events/dto/idRefDto";
import {Event} from "../../events/entity/event";
import DateCalc from "../../events/utils/eventUtils";
import UserUtils from "../utils/userUtils";

@Controller("users")
export class UsersController {
  @Inject()
  usersService: UsersService;

  // @UseInterceptors(ClassSerializerInterceptor)
  // @Get(":id/userCriteriaRating")
  // async getUserCriteriaRating(  @Param("id") userId: number):Promise<User[]> {
  //   return(await UserUtils.getUserCriteriaRating(userId))
  // }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id/userCriteriaRating")
  async getUserCriteriaRating(  @Param("id") eventId: number) {
    //console.log((await UserUtils.getUserCriteriaRating(eventId)))
    return (await UserUtils.getUserCriteriaRating(eventId))
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id/userRating")
  async getUserRating(  @Param("id") eventId: number):Promise<User[]> {
    return (await UserUtils.getUserRating(eventId))
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(":id/criteria")
  addCriteria(
      @Param("id") userId: number,
      @Body() criteriaRef: idRefDto
  ): Promise<User> {
    return this.usersService.addCriteria(userId, criteriaRef);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(): Promise<User[]> {
    logger.info('Get all users');
   // console.log((await this.usersService.findAll()).map(user => {user.events.criteria}))
    return (await this.usersService.findAll()).map(user => userGetDto(user));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: number): Promise<User> {
    return userGetDto(await this.usersService.findOne(id));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(":id")
  update(
    @Param("id") id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(":id")
  remove(@Param("id") id: number): Promise<User> {
    return this.usersService.remove(id);
  }
}
