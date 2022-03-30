import {Criteria} from "../entity/criteria";

export const criteriaGetDto = (criteria: Criteria): Criteria => {
  return ({
    id: criteria.id,
    name: criteria.name,
    criteria: criteria.criteria,
    events: criteria.events,
    subCriteria: criteria.subCriteria,
  });
};
