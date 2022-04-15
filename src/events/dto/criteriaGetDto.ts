import { Criteria, CriteriaPivotDto } from '../entity/criteria';
import { pivotGetDto } from './pivotGetDto';

export const criteriaGetDto = (criteria: Criteria): CriteriaPivotDto => {
  return {
    id: criteria.id,
    name: criteria.name,
    criteria: criteria.criteria,
    rating: criteria.rating,
    pivot: criteria?.pivot?.length
      ? criteria.pivot.map((pivot) => pivotGetDto(pivot))
      : []
  };
};
