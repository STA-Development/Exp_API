import { IsString, IsEmail, IsNumber, IsOptional } from 'class-validator';
import { User } from '../entity/user';
import { ApiProperty } from '@nestjs/swagger';

export class AddUserDto extends User {
  readonly id: number;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNumber()
  salary: number;

  @ApiProperty()
  @IsString()
  position: string;

  @IsOptional()
  avatar: string;
}
