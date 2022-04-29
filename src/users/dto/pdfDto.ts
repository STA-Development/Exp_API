import {
  IsNumber,
  IsString
} from "class-validator";
import { User } from '../entity/user';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePdtDto extends User {

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNumber()
  totalScore: number;
}
