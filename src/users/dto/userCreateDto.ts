import { IsString, IsEmail, IsNumber, IsOptional, IsEmpty } from 'class-validator';
import { User } from '../entity/user';
import { Pivot } from '../../events/entity/pivot';
import { Event } from "../../events/entity/event";
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends User {
  readonly id: number;

  @ApiProperty()
  @IsString()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  readonly lastName: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
   password: string;

  @IsOptional()
  avatar: string;

  @IsEmpty()
  readonly events: Event[];

  @IsNumber()
  readonly rating: number;

  @IsOptional()
  readonly performerType: string;

  @IsOptional()
  pivot: Pivot[];
}
