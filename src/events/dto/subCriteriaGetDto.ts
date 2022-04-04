import { SubCriteria } from "../entity/subCriteria";
import {criteriaGetDto} from "./criteriaGetDto";
import {eventGetDto} from "./eventGetDto";

export const subCriteriaGetDto = (subCriteria: SubCriteria): SubCriteria => {
 // console.log(`This is our subCriteriaDto`)
  return ({
    id: subCriteria.id,
    name: subCriteria.name,
    subCriteria: subCriteria.subCriteria,
    criteria:  ((!subCriteria.criteria) ? subCriteria.criteria : criteriaGetDto(subCriteria.criteria)),
  });
};
