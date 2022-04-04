import {
  IsString,
  IsInt,
  IsEnum,
  IsDate,
  IsNotEmpty,
  IsOptional, IsNumber, Min, Max,
} from "class-validator";

import { Period } from "../interface/eventInterface";
import { User } from "../../users/entity/user";
import {Criteria} from "../entity/criteria";
import {Rating} from "../entity/rating";

export class CreateEventDto {
  @IsString()
  readonly title: string;

  @IsInt()
  @Min(0)
  @Max(100)
  readonly bonus: number;

  @IsOptional()
  rating: Rating[];

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
