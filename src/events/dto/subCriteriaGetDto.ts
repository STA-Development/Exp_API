import { SubCriteria } from "../entity/subCriteria";
import {criteriaGetDto} from "./criteriaGetDto";

export const subCriteriaGetDto = (subCriteria: SubCriteria): SubCriteria => {
  return ({
    id: subCriteria.id,
    name: subCriteria.name,
    state: subCriteria.state,
    criteria:  subCriteria?.criteria ? criteriaGetDto(subCriteria.criteria) : subCriteria.criteria, //TODO after :
  });
};
