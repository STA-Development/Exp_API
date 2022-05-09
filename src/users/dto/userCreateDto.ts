import {ApiProperty} from '@nestjs/swagger'
import {IsString, IsEmail, IsOptional, IsEmpty, IsEnum} from 'class-validator'
import {User} from '../entity/user'
import {Event} from '../../events/entity/event'
import {PerformerType} from '../interface/userInterface'

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

  @IsEmpty()
  readonly events: Event[]

  @IsOptional()
  readonly rating: number

  @IsEnum(PerformerType)
  performerType: PerformerType
}
