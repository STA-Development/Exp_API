import { SubCriteria, SubCriteriaDto } from '../entity/subCriteria';

export const subCriteriaGetDto = (
  subCriteria: SubCriteria
): SubCriteriaDto => ({
  id: subCriteria.id,
  name: subCriteria.name,
  result: subCriteria.result,
  criteria: subCriteria.criteria
});
