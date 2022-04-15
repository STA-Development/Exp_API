import { IsString, IsEmail, IsNumber, IsOptional, IsEmpty } from 'class-validator';
import { User } from '../entity/user';
import { Pivot } from '../../events/entity/pivot';
import { Event } from "../../events/entity/event";
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

  @IsNumber()
  readonly rating: number;

  @IsOptional()
  readonly performerType: string;

  @IsOptional()
  pivot: Pivot[];
}
