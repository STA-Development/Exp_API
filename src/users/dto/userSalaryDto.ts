import {IsNumber} from 'class-validator'
import {User} from '../entity/user'
import {ApiProperty} from '@nestjs/swagger'

export class UserSalaryDto extends User {
  @ApiProperty()
  @IsNumber()
  salary: number
}
