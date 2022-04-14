import { CriteriaPivotDto } from "../entity/criteria";
import { pivotGetDto } from "./pivotGetDto";

export const criteriaGetDto = (
  criteria: CriteriaPivotDto
): CriteriaPivotDto => {
  return {
    id: criteria.id,
    name: criteria.name,
    criteria: criteria.criteria,
    rating: criteria.rating,
    pivot: criteria?.pivot?.length
      ? criteria.pivot.map((pivot) => pivotGetDto(pivot))
      : criteria.pivot,
  };
};
