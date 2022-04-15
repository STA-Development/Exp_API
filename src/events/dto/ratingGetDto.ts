import { Rating, RatingPivotDto } from '../entity/rating';
import { pivotGetDto } from './pivotGetDto';

export const ratingGetDto = (rating: Rating): RatingPivotDto => {
  return {
    id: rating.id,
    from: rating.from,
    to: rating.to,
    isSelected: rating.isSelected,
    pivot: rating?.pivot?.length
      ? rating.pivot.map((pivot) => pivotGetDto(pivot))
      : []
  };
};
