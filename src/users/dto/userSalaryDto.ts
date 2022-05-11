import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { User } from '../entity/user';

export class UserSalaryDto extends User {
  @ApiProperty()
  @IsNumber()
  salary: number;
}
