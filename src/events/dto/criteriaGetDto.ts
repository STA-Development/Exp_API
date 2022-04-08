import {Criteria} from "../entity/criteria";
import {eventGetDto} from "./eventGetDto";
import {subCriteriaGetDto} from "./subCriteriaGetDto";
import {userGetDto} from "../../users/dto/userGetDto";


export const criteriaGetDto = (criteria: Criteria): Criteria => {
  return ({
    id: criteria.id,
    name: criteria.name,
    criteria: criteria.criteria,
    rating: criteria.rating,
    events: criteria?.events?.length ? criteria.events.map(event => eventGetDto(event)) : [],
    subCriteria: criteria?.subCriteria?.length ? criteria.subCriteria.map(subCriteria => subCriteriaGetDto(subCriteria)) : [],
    users: criteria?.users?.length ? criteria.users.map( user => userGetDto(user)) : [], ////
  });
};

