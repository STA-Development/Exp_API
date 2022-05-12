import { SubCriteria, SubCriteriaDto } from '../entity/subCriteria';

export const subCriteriaGetDto = (
  subCriteria: SubCriteria
): SubCriteriaDto => ({
  id: subCriteria.id,
  name: subCriteria.name,
  result: subCriteria.result,
  point: subCriteria.point,
  criteria: subCriteria.criteria
});
