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
  Query,
  UseGuards,
  Patch,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from '../service/userService';
import { CreateUserDto } from '../dto/userCreateDto';
import { UpdateUserDto } from '../dto/userUpdateDto';
import { User, UserPivot } from '../entity/user';
import { AuthGuard } from '../../middlewares/checkJwt';
import { RolesGuard } from '../../middlewares/checkAdmin';
import { Token } from '../../middlewares/jwtDecorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { logger } from '../../logger';
import { userGetDto } from '../dto/userGetDto';

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
  @Get()
  async findAll(
    @Query('limit') limit: number,
    @Query('page') page: number
  ): Promise<{ pageCount: number; data: UserPivot[] }> {
    logger.info('Get all users');
    const users = await this.usersService.findAll(limit, page);
    const data = users.data.map((user) => userGetDto(user));
    return { data, pageCount: users.count };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('me')
  findOne(@Token() uid: string): Promise<User> {
    return this.usersService.findOne(uid);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async find(@Param('id') id: number): Promise<UserPivot> {
    return userGetDto(await this.usersService.findOneById(id));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: number): Promise<User> {
    return this.usersService.remove(id);
  }

  @Patch('avatar')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('avatar'))
  changeUserImg(
    @UploadedFile() file: Express.Multer.File,
    @Token() uid: string
  ): Promise<User> {
    return this.usersService.uploadImageToCloudinary(file, uid);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch(':id/salary')
  changeSalary(
    @Body() body: { salary: number },
    @Param('id') id: number
  ): Promise<User> {
    return this.usersService.changeSalary(body.salary, id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch(':id/disabled')
  deactivateUser(@Param('id') id: number) {
    return this.usersService.userDeactivate(id);
  }
}
