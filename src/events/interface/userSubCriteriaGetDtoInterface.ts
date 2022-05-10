import {CriteriaDto} from '../entity/criteria'
import {EventDto} from '../entity/event'
import {RatingDto} from '../entity/rating'
import {SubCriteriaDto} from '../entity/subCriteria'
import {UserDto} from '../../users/entity/user'

export interface IUserSubCriteriaGetDto {
  criteria: CriteriaDto
  event: EventDto
  rating: RatingDto
  subCriteria: SubCriteriaDto
  user: UserDto
}
