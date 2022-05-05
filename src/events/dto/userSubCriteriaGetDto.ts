import {UserSubCriteria, UserSubCriteriaDto} from '../entity/userSubCriteria'
import {criteriaGetDto} from './criteriaGetDto'
import {eventGetDto} from './eventGetDto'
import {userGetDto} from '../../users/dto/userGetDto'
import {subCriteriaGetDto} from './subCriteriaGetDto'
import {ratingGetDto} from './ratingGetDto'

export const userSubCriteriaGetDto = (userSubCriteria: UserSubCriteria): UserSubCriteriaDto => ({
  criteria: userSubCriteria?.criteria && criteriaGetDto(userSubCriteria.criteria),
  event: userSubCriteria?.event && eventGetDto(userSubCriteria.event),
  rating: userSubCriteria?.rating && ratingGetDto(userSubCriteria.rating),
  subCriteria: userSubCriteria?.subCriteria && subCriteriaGetDto(userSubCriteria.subCriteria),
  user: userSubCriteria?.user && userGetDto(userSubCriteria.user),
})
