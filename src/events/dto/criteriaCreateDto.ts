import {
  IsString,
  IsBoolean,
  IsOptional,
} from "class-validator";
import {SubCriteria} from "../entity/subCriteria";
import {Event} from "../entity/event";

export class CreateCriteriaDto {

  @IsString()
  readonly name: string;

  @IsBoolean()
  readonly criteria: boolean;

  @IsOptional() //
  readonly subCriteria: SubCriteria[];

  @IsOptional() //
  readonly events: Event[];
}
