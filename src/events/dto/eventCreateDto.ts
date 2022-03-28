import {
  IsString,
  IsInt,
  IsEnum,
  IsEmpty,
  IsDate,
  IsNotEmpty,
  isNotEmpty, IsObject, IsOptional, IsDateString, IsISO8601, IsNumber,
} from "class-validator";

import { Period } from "../interface/eventInterface";
import { User } from "../../users/entity/user";
import {Criteria} from "../entity/criteria";

export class CreateEventDto {
  @IsString()
  readonly title: string;

  @IsInt()
  readonly bonus: number;

  @IsInt()
  readonly rating: number;

  @IsEnum(Period)
  readonly TimePeriod: Period;

  @IsNotEmpty()
  users: User[];

  @IsNotEmpty()
  criteria: Criteria[];

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsNumber()
  endsAt: Date;

}
