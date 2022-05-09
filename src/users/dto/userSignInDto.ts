import { IsString, IsEmail } from 'class-validator';
import { User } from '../entity/user';
import { ApiProperty } from '@nestjs/swagger';

export class UserSignInDto extends User {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}
