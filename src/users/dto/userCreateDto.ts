import { IsString, IsEmail, IsNumber, IsOptional } from "class-validator";
import { User } from "../entity/user";
import { Pivot } from "../../events/entity/pivot";

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

  @IsOptional()
  pivot: Pivot[];
}
