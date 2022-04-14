import { SubCriteriaPivotDto } from "../entity/subCriteria";
import { pivotGetDto } from "./pivotGetDto";

export const subCriteriaGetDto = (
  subCriteria: SubCriteriaPivotDto
): SubCriteriaPivotDto => {
  return {
    id: subCriteria.id,
    name: subCriteria.name,
    state: subCriteria.state,
    pivot: subCriteria?.pivot?.length
      ? subCriteria.pivot.map((pivot) => pivotGetDto(pivot))
      : subCriteria.pivot,
  };
};
