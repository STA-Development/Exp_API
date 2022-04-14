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
import { User, UserPivot } from "../entity/user";
import { logger } from "../../logger";
import { userGetDto } from "../dto/userGetDto";
import UserUtils from "../utils/userUtils";

@Controller("users")
export class UsersController {
  @Inject()
  usersService: UsersService;

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id/userCriteriaRating")
  async getUserCriteriaRating(@Param("id") eventId: number) {
    return await UserUtils.getUserCriteriaRating(eventId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id/userRating")
  async getUserRating(@Param("id") eventId: number) {
    return await UserUtils.getUserRating(eventId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(): Promise<UserPivot[]> {
    logger.info("Get all users");
    return (await this.usersService.findAll()).map((user) => userGetDto(user));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: number): Promise<UserPivot> {
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
