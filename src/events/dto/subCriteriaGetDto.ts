import { SubCriteria, SubCriteriaPivotDto } from '../entity/subCriteria';
import { pivotGetDto } from './pivotGetDto';

export const subCriteriaGetDto = (
  subCriteria: SubCriteria
): SubCriteriaPivotDto => {
  return {
    id: subCriteria.id,
    name: subCriteria.name,
    result: subCriteria.result,
    pivot: subCriteria?.pivot?.length
      ? subCriteria.pivot.map((pivot) => pivotGetDto(pivot))
      : []
  };
};
