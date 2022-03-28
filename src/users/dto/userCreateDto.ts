import { IsString, IsEmail, IsEmpty } from "class-validator";
import { User } from "../entity/user";
import { Event } from "../../events/entity/event";

export class CreateUserDto extends User {

  readonly id: number;

  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsEmail()
  readonly email: string;

  @IsEmpty()
  readonly events: Event[];
}
