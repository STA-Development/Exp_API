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
import { Event } from "../entity/event";
import { Timestamp } from "typeorm";
import { User } from "../entity/user";

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

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsNumber()
  endsAt: Date;

  // @IsNotEmpty()
  // criteria: [];

}
