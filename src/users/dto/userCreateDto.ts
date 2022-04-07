import { IsString, IsEmail, IsEmpty,IsOptional } from "class-validator";
import { User } from "../entity/user";
import { Event } from "../../events/entity/event";

export class CreateUserDto extends User {

  readonly id: number;

  @IsString()
  readonly firstName: string;

  @IsOptional()
  authUid: string;

  @IsString()
   password: string;

  @IsString()
  readonly lastName: string;

  @IsOptional()
  avatar: string;

  @IsEmail()
  readonly email: string;

  @IsEmpty()
  readonly events: Event[];
}
