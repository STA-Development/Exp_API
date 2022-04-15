import { IsString, IsBoolean, IsOptional, IsNumber } from "class-validator";
import { Pivot } from "../entity/pivot";

export class CreateCriteriaDto {
  @IsString()
  readonly name: string;

  @IsBoolean()
  readonly criteria: boolean;

  @IsNumber()
  readonly rating: number;

  @IsOptional()
  pivot: Pivot[];
}
