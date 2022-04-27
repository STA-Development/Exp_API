import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
  Patch,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { ApiFile } from '../dto/createPdfDto';
import { UsersService } from '../service/userService';
import { CreateUserDto } from '../dto/userCreateDto';
import { UpdateUserDto } from '../dto/userUpdateDto';
import { UserSalaryDto } from '../dto/userSalaryDto';
import { User, UserPivot } from '../entity/user';
import { AuthGuard } from '../../middlewares/checkJwt';
import { Token } from '../../middlewares/jwtDecorator';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { logger } from '../../logger';
import { userGetDto } from '../dto/userGetDto';
import { AddUserDto } from '../dto/addUserDto';
import { GetUserDto } from '../dto/getUsersDto';

@Controller('users')
export class UsersController {
  @Inject()
  usersService: UsersService;

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: GetUserDto })
  @Get()
  async findAll(): Promise<UserPivot[]> {
    logger.info('Get all users');
    return (await this.usersService.findAll()).map((user) => user); //TODO dto
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: GetUserDto })
  @Get('me')
  findOne(@Token() uid: string): Promise<User> {
    return this.usersService.findOne(uid);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @ApiOkResponse({ type: GetUserDto })
  async find(@Param('id') id: number): Promise<UserPivot> {
    return userGetDto(await this.usersService.findOneById(id));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @Token() uid: string): Promise<User> {
    return this.usersService.remove(id, uid);
  }

  @Patch('avatar')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiFile()
  changeUserImg(
    @UploadedFile('file') file: Express.Multer.File,
    @Token() uid: string
  ): Promise<User> {
    return this.usersService.uploadImageToCloudinary(file, uid);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch(':id/salary')
  changeSalary(
    @Token() uid: string,
    @Body() userSalaryDto: UserSalaryDto,
    @Param('id') id: number
  ): Promise<User> {
    return this.usersService.changeSalary(uid, userSalaryDto, id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('addUser')
  async addUser(@Body() addUserDto: AddUserDto): Promise<User> {
    return this.usersService.addUser(addUserDto);
  }
}
