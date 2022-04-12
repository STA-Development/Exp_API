import { IsString, IsEmail, IsEmpty, IsOptional } from 'class-validator';
import { User } from '../entity/user';
import { Event } from '../../events/entity/event';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends User {
  readonly id: number;

  @ApiProperty()
  @IsString()
  firstName: string;

  @IsOptional()
  authUid: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @IsOptional()
  avatar: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @IsEmpty()
  readonly events: Event[];
}
