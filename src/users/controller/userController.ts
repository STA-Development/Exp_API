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
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from '../service/userService';
import { CreateUserDto } from '../dto/userCreateDto';
import { UpdateUserDto } from '../dto/userUpdateDto';
import { User, UserPivot } from '../entity/user';
import { AuthGuard } from '../../middlewares/checkJwt';
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
  async findAll(): Promise<UserPivot[]> {
    logger.info('Get all users');
    return (await this.usersService.findAll()).map((user) => user); //TODO dto
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
  @UseInterceptors(FileInterceptor('avatar'))
  changeUserImg(
    @UploadedFile() file: Express.Multer.File,
    @Token() uid: string
  ): Promise<User> {
    return this.usersService.uploadImageToCloudinary(
      file,
      uid
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch(':id/salary')
  changeSalary(
    @Token() uid: string,
    @Body() body: { salary: number },
    @Param('id') id: number
  ): Promise<User> {
    return this.usersService.changeSalary(uid, body.salary, id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch(':id/access')
  deactivateUser(
    @Param('id') id: number
  ): Promise<string> {
    return this.usersService.userAccess(id);
  }
}
