import {Event} from '../entity/event'
import {Criteria} from '../entity/criteria'
import {Rating} from '../entity/rating'
import {SubCriteria} from '../entity/subCriteria'
import {User} from '../../users/entity/user'

export interface IUserSubCriteria {
  eventId: number
  criteriaId: number
  ratingId: number
  userId: number
  subCriteriaId: number
  subCriteriaResult: boolean
  event: Event
  criteria: Criteria
  rating: Rating
  subCriteria: SubCriteria
  user: User
}
