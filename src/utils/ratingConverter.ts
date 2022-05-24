import { PerformerType } from '../enums/performerType';

export const ratingConverter = (rating) => {
  if (9 < rating && rating <= 10) return PerformerType.rockStar;
  else if (5.2 < rating && rating <= 9) return PerformerType.goodPotential;
  else if (0 <= rating && rating <= 5.2) return PerformerType.needHelp;
  return rating;
};
