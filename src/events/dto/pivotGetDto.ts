import { PivotDto } from "../entity/pivot";
import { criteriaGetDto } from "./criteriaGetDto";
import { eventGetDto } from "./eventGetDto";
import { userGetDto } from "../../users/dto/userGetDto";
import { subCriteriaGetDto } from "./subCriteriaGetDto";
import { ratingGetDto } from "./ratingGetDto";

export const pivotGetDto = (pivot: PivotDto): PivotDto => {
  return {
    id: pivot.id,
    criteria: pivot?.criteria ? criteriaGetDto(pivot.criteria) : pivot.criteria,
    event: pivot?.event ? eventGetDto(pivot.event) : pivot.event,
    rating: pivot?.rating ? ratingGetDto(pivot.rating) : pivot.rating,
    subCriteria: pivot?.subCriteria
      ? subCriteriaGetDto(pivot.subCriteria)
      : pivot.subCriteria,
    user: pivot?.user ? userGetDto(pivot.user) : pivot.user,
  };
};
