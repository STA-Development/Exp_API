import {IsString, IsEmail, IsEmpty, IsNumber, IsOptional} from "class-validator";
import { User } from "../entity/user";
import { Event } from "../../events/entity/event";
import {Criteria} from "../../events/entity/criteria";

export class CreateUserDto extends User {

  readonly id: number;

  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsEmail()
  readonly email: string;

  @IsNumber()
  readonly rating: number;

  @IsOptional()
  readonly performerType: string;

  @IsEmpty()
  readonly events: Event[];

  @IsOptional()
  readonly criteria: Criteria[];
}
