import {
  IsString,
  IsBoolean, IsOptional,
} from "class-validator";
import {Criteria} from "../entity/criteria";
import {SubCriteria} from "../entity/subCriteria";

export class CreateSubCriteriaDto extends SubCriteria{

  @IsString()
  readonly name: string;

  @IsBoolean()
  readonly subCriteria: boolean;

  @IsOptional()
  readonly criteria: Criteria;

}
