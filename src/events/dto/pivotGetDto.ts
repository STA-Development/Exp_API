import { Pivot, PivotDto } from '../entity/pivot';
import { criteriaGetDto } from './criteriaGetDto';
import { eventGetDto } from './eventGetDto';
import { userGetDto } from '../../users/dto/userGetDto';
import { subCriteriaGetDto } from './subCriteriaGetDto';
import { ratingGetDto } from './ratingGetDto';

export const pivotGetDto = (pivot: Pivot): PivotDto => {
  return {
    // id: pivot.id,
    criteria: pivot?.criteria && criteriaGetDto(pivot.criteria),
    event: pivot?.event && eventGetDto(pivot.event),
    rating: pivot?.rating && ratingGetDto(pivot.rating),
    subCriteria: pivot?.subCriteria && subCriteriaGetDto(pivot.subCriteria),
    user: pivot?.user && userGetDto(pivot.user)
  };
};
