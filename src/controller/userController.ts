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
  Res,
  Response,
  UseGuards,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {UsersService} from '../service/userService';
import {CreateUserDto} from '../dto/userCreateDto';
import {UpdateUserDto} from '../dto/userUpdateDto';
import {User} from '../entity/user';
import { sendEmail } from '../utils/sendEmail';
import {JwtService} from '@nestjs/jwt';
import {AuthGuard} from '../middlewares/checkJwt'
import * as bcrypt from 'bcrypt';
import * as jwt from "jsonwebtoken";
import {JwtPayload} from "jsonwebtoken";
import {Token} from '../middlewares/jwtDecorator';

@Controller('users')
  export class UsersController {
  constructor(
      private jwtService: JwtService
  ) {}

  @Inject()
  usersService: UsersService;
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('create')
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    createUserDto.password = hashedPassword;
    return this.usersService.create(createUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @Get()
  findAll(): Promise<Array<User>> {
    return this.usersService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
    async login(
       @Body() login: {email: string, password: string},
       @Response({passthrough: true}) response
  ): Promise<string> {
     const user =  await this.usersService.findOneEmail(login.email);
    if (!user) {
      throw new BadRequestException('invalid credentials1');
    }
    if (!await bcrypt.compare(login.password, user.password)) {
      throw new BadRequestException('invalid credentials2');
    }
    const jwt = await this.jwtService.signAsync({id: user.id},
        {secret: process.env.JWT_ACCESS, expiresIn: '1h' });
    return jwt ;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @Get('me')
  async findOne(@Token() data: number): Promise<User> {
   return await this.usersService.findOne(data)
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
  @Delete(':id')
  remove(@Param('id') id: number): Promise<User> {
    return this.usersService.remove(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('forgot')
  async forgotPassword(
      @Body() forgot: {email: string},
  ): Promise<string> {
       const user =  await this.usersService.findOneEmail(forgot.email);
       const forgotJwt = <string>await this.jwtService.signAsync({id: user.id},
        {secret: process.env.JWT_ACCESS_FORGOT, expiresIn: '1m' });
       const link ="http://localhost:3000/users/reset/?code="+forgotJwt;
       await sendEmail(forgot.email, link);
       return forgotJwt;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('reset')
  async resetPassword(
       @Body() reset: {password: string,confirmPass: string,token:string}
  ): Promise<string> {
    try{
       const jwtPayload: JwtPayload | string = jwt.verify(reset.token, process.env.JWT_ACCESS_FORGOT);
     if(reset.password==reset.confirmPass){
          const hashedPassword = await bcrypt.hash(reset.password, 12);
        if(typeof jwtPayload !== "string") {
          this.usersService.resetFindeOne(jwtPayload.id,hashedPassword);
      return  "pass is changed";
    }
     }}
    catch(error){
      return "try again" ;
    }
  }

  @Patch('avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async changeUserImg(@UploadedFile() file: Express.Multer.File,@Token() data: number,
  ): Promise<object> {
    return this.usersService.uploadImageToCloudinary(file,data);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @Patch(':id/salary')
  async changeSalary(
    @Token() data: number,
    @Body() salary: {salary: number},
    @Param('id') id:number
  ): Promise<User> {
    return await this.usersService.changeSalary(data,salary.salary,id)
  }
}
