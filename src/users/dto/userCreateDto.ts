import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { User } from '../entity/user';
import { PerformerType } from '../interface/userInterface';

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
  email: string;

  @IsOptional()
  readonly rating: number;

  @IsEnum(PerformerType)
  @IsOptional()
  performerType: PerformerType;
}
