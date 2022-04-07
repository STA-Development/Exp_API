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
  UseInterceptors,
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import { UsersService } from "../service/userService";
import { CreateUserDto } from "../dto/userCreateDto";
import { UpdateUserDto } from "../dto/userUpdateDto";
import { User } from "../entity/user";
import {AuthGuard} from '../../middlewares/checkJwt'
import {Token} from '../../middlewares/jwtDecorator';

@Controller("users")
export class UsersController {

  @Inject()
  usersService: UsersService;
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
     createUserDto.avatar=process.env.AVATAR_URL;
    return this.usersService.create(createUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @Get()
  findAll(): Promise<Array<User>> {
    return this.usersService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @Get('me')
   findOne(@Token() data: string): Promise<User> {
    return  this.usersService.findOne(data)
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
  remove(@Param('id') id: number,@Token() data: string): Promise<User> {
    return this.usersService.remove(id,data);
  }

  @Patch('avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
   changeUserImg(@UploadedFile() file: Express.Multer.File,@Token() data: string,
  ): Promise<object> {
    return this.usersService.uploadImageToCloudinary(file,data);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @Patch(':id/salary')
   changeSalary(
    @Token() data: string,
    @Body() body: {salary: number},
    @Param('id') id:number
  ): Promise<User> {
    return  this.usersService.changeSalary(data,body.salary,id)
  }
}