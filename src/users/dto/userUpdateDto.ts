import { IsString, IsEmail } from 'class-validator';
import { User } from '../entity/user';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends User {
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
}
