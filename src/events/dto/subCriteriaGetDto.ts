import { SubCriteria } from "../entity/subCriteria";

export const subCriteriaGetDto = (criteria: SubCriteria): SubCriteria => {
  return ({
    id: criteria.id,
    name: criteria.name,
    subCriteria: criteria.subCriteria,
    criteria: criteria.criteria,
  });
};
