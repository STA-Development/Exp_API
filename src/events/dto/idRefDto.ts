import { IsInt } from "class-validator";
import { IIdRefDto } from "../interface/idRefInterface";

export class idRefDto implements IIdRefDto {
  @IsInt()
  readonly id: number;
}
