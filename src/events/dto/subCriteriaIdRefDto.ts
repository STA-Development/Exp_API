import { IsInt } from "class-validator";
import { ISubCriteriaRef } from "../interface/subCriteriaRefInterface";

export class SubCriteriaIdRefDto implements ISubCriteriaRef {
  @IsInt()
  userId: number;

  @IsInt()
  subCriteriaId: number;
}
