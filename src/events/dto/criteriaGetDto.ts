import {Criteria, CriteriaDto} from '../entity/criteria'
import {subCriteriaGetDto} from './subCriteriaGetDto'

export const criteriaGetDto = (criteria: Criteria): CriteriaDto => ({
  id: criteria.id,
  name: criteria.name,
  criteria: criteria.criteria,
  subCriteria:
    criteria?.subCriteria &&
    criteria.subCriteria.map((subCriteria) => subCriteriaGetDto(subCriteria)),
})
