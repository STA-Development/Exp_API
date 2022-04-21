import {IsString, IsEmail, IsNumber, IsOptional} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger'
import {User} from '../entity/user'

export class CreateUserDto extends User {
  readonly id: number

  @ApiProperty()
  @IsString()
  firstName: string

  @IsOptional()
  authUid: string

  @ApiProperty()
  @IsString()
  password: string

  @ApiProperty()
  @IsString()
  lastName: string

  @IsOptional()
  avatar: string

  @ApiProperty()
  @IsEmail()
  readonly email: string

  @IsOptional()
  readonly rating: number

  @IsOptional()
  readonly performerType: string
}
