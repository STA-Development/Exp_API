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
  UseGuards,
  Patch,
  UseInterceptors
} from '@nestjs/common';
import {UsersService} from '../service/userService';
import {CreateUserDto} from '../dto/userCreateDto';
import {UpdateUserDto} from '../dto/userUpdateDto';
import {User} from '../entity/user';
import { sendEmail } from '../utils/sendEmail';
const td=require('../utils/sendEmail')
import {Response} from 'express';
import {JwtService} from '@nestjs/jwt';
import {AuthGuard} from '../middlewares/checkJwt'
import * as bcrypt from 'bcrypt';
import * as jwt from "jsonwebtoken";
import {JwtPayload} from "jsonwebtoken";


interface IJwt {
  id: string
}
@Controller('users')
export class UsersController {
  constructor(

      private jwtService: JwtService
  ) {
  }

  @Inject()
  usersService: UsersService;

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    // console.log(hashedPassword, createUserDto.password, "ashgaklsjjkashgashjk")
    console.log(createUserDto)
    createUserDto.password = hashedPassword
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
       @Res({passthrough: true}) response: Response
  ): Promise<string> {
    console.log('ahaaa');
    console.log(login.email)
    console.log(login.password)
    const user =  await this.usersService.findOneEmail(login.email);

    if (!user) {
      throw new BadRequestException('invalid credentials1');
    }
// console.log(user.password)
//     console.log(login.password)
//     console.log(user)
    console.log(login.password, user.password)

    if (!await bcrypt.compare(login.password, user.password)) {
      throw new BadRequestException('invalid credentials2');
    }


    const jwt = await this.jwtService.signAsync({id: user.id}, {secret: process.env.JWT_ACCESS, expiresIn: '1h' });



    console.log(jwt)
    return jwt ;
  }


  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id);
  }

  // test forgot password

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('forgot')
  async forgotPassword(
      @Body() forgot: {email: string},

  ): Promise<string> {
    console.log(forgot.email)

    const user =  await this.usersService.findOneEmail(forgot.email);
    const forgotJwt = <string>await this.jwtService.signAsync({id: user.id}, {secret: process.env.JWT_ACCESS, expiresIn: '1m' });
    console.log(forgotJwt )
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

     const jwtPayload: JwtPayload | string = jwt.verify(reset.token, process.env.JWT_ACCESS);
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
}
