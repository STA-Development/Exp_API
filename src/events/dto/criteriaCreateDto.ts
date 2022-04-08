import {
  IsString,
  IsBoolean,
  IsOptional, IsNumber,
} from "class-validator";
import {SubCriteria} from "../entity/subCriteria";
import {Event} from "../entity/event";
import {User} from "../../users/entity/user";
export class CreateCriteriaDto {

  @IsString()
  readonly name: string;

  @IsBoolean()
  readonly criteria: boolean;

  @IsNumber()
  readonly rating: number;

  @IsOptional()
  readonly subCriteria: SubCriteria[];

  @IsOptional()
  readonly events: Event[];

  @IsOptional()
  readonly users: User[];

}
