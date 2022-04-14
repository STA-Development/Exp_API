import { IsString, IsBoolean, IsOptional } from "class-validator";
import { SubCriteria } from "../entity/subCriteria";
import { Pivot } from "../entity/pivot";

export class CreateSubCriteriaDto extends SubCriteria {
  @IsString()
  readonly name: string;

  @IsBoolean()
  readonly state: boolean;

  @IsOptional()
  pivot: Pivot[];
}
