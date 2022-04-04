import {Criteria} from "../entity/criteria";
import {eventGetDto} from "./eventGetDto";
import {subCriteriaGetDto} from "./subCriteriaGetDto";

export const criteriaGetDto = (criteria: Criteria): Criteria => {
 //  console.log(`This is our criteriaDto: ${Boolean(criteria.id)},       "":::"" ${criteria.id}`)
  return ({
    id: criteria.id,
    name: criteria.name,
    criteria: criteria.criteria,
    events: ((!criteria.events || !criteria.events.length) ? criteria.events : criteria.events.map(event => eventGetDto(event))),
    subCriteria: ((!criteria.subCriteria || !criteria.subCriteria.length) ? criteria.subCriteria : criteria.subCriteria.map(subCriteria => subCriteriaGetDto(subCriteria))),
  });
};

