import { CriteriaPivotDto } from "../entity/criteria";
import { EventPivotDto } from "../entity/event";
import { RatingPivotDto } from "../entity/rating";
import { SubCriteriaPivotDto } from "../entity/subCriteria";
import { UserPivot } from "../../users/entity/user";

export interface IPivotGetDto {
  id: number;
  criteria: CriteriaPivotDto;
  event: EventPivotDto;
  rating: RatingPivotDto;
  subCriteria: SubCriteriaPivotDto;
  user: UserPivot;
}
