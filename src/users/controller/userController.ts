import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Response,
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
import { sendEmail } from '../../utils/sendEmail';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../../middlewares/checkJwt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Token } from '../../middlewares/jwtDecorator';
import { ApiProperty, ApiBearerAuth } from '@nestjs/swagger';
import { logger } from '../../logger';
import { userGetDto } from '../dto/userGetDto';
import { UpdateResult } from 'typeorm';
@Controller('users')
export class UsersController {
  constructor(private jwtService: JwtService) {}

  @Inject()
  usersService: UsersService;
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      +process.env.BCRYPT_KEY
    );
    createUserDto.password = hashedPassword;
    createUserDto.avatar = process.env.AVATAR_URL;
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
  @Get(':id')
  async find(@Param('id') id: number): Promise<UserPivot> {
    return userGetDto(await this.usersService.findOne(id));
  }

  @Post('login')
  async login(
    @Body() login: { email: string; password: string },
    @Response({ passthrough: true }) response
  ): Promise<object> {
    const user = await this.usersService.findOneEmail(login.email);
    if (!user) {
      throw new BadRequestException('invalid credentials');
    }
    if (!(await bcrypt.compare(login.password, user.password))) {
      throw new BadRequestException('invalid credentials');
    }
    const accesToken: string = await this.jwtService.signAsync(
      { id: user.id },
      {
        secret: process.env.JWT_ACCESS,
        expiresIn: process.env.LOGIN_ACCESS_TOKEN_TIME
      }
    );
    const refreshToken: string = await this.jwtService.signAsync(
      { id: user.id },
      {
        secret: process.env.JWT_ACCESS,
        expiresIn: process.env.LOGIN_REFRESH_TOKEN_TIME
      }
    );
    return { accesToken, refreshToken };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('me')
  findOne(@Token() data: number): Promise<User> {
    return this.usersService.findOne(data);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UpdateResult> {
    return this.usersService.update(id, updateUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<User> {
    return this.usersService.remove(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('forgot')
  async forgotPassword(@Body() forgot: { email: string }): Promise<string> {
    const user = await this.usersService.findOneEmail(forgot.email);
    const accesToken: string = await this.jwtService.signAsync(
      { id: user[0].id }, //TODO
      {
        secret: process.env.JWT_ACCESS,
        expiresIn: process.env.FORGOT_ACCESS_TOKEN_TIME
      }
    );
    const refreshToken: string = await this.jwtService.signAsync(
      { id: user.id },
      {
        secret: process.env.JWT_ACCESS,
        expiresIn: process.env.FORGOT_REFRESH_TOKEN_TIME
      }
    );
    const link = process.env.FORGOT_LINK + accesToken;
    await sendEmail(forgot.email, link);
    return 'The mail was sent';
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('reset')
  async resetPassword(
    @Body() reset: { password: string; confirmPass: string; token: string }
  ): Promise<string> {
    try {
      const jwtPayload: jwt.JwtPayload | string = jwt.verify(
        reset.token,
        process.env.JWT_ACCESS_FORGOT
      ) as jwt.JwtPayload;
      if (reset.password === reset.confirmPass) {
        const hashedPassword = await bcrypt.hash(
          reset.password,
          +process.env.BCRYPT_KEY
        );
        this.usersService.resetFindeOne(jwtPayload.id, hashedPassword);
        return 'pass is changed';
      }
    } catch (error) {
      return error;
    }
  }

  @Patch('avatar')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('avatar'))
  changeUserImg(
    @UploadedFile() file: Express.Multer.File,
    @Token() data: number
  ): Promise<object> {
    return this.usersService.uploadImageToCloudinary(file, data);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch(':id/salary')
  changeSalary(
    @Token() data: number,
    @Body() body: { salary: number },
    @Param('id') id: number
  ): Promise<User> {
    return this.usersService.changeSalary(data, body.salary, id);
  }
}
