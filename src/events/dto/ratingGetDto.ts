import {Rating, RatingDto} from '../entity/rating'

export const ratingGetDto = (rating: Rating): RatingDto => ({
  id: rating.id,
  from: rating.from,
  to: rating.to,
  isSelected: rating.isSelected,
  events: rating.events, // todo dto
})
