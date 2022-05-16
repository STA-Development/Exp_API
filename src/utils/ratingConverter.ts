import { PerformerType } from "../enums/performerType";

export const ratingConverter = (rating) =>{
  if (9 < rating && rating <= 10) rating = PerformerType.rockStar;
  else if (5.2 < rating && rating <= 9) rating = PerformerType.goodPotential;
  else if (0 <= rating && rating <= 5.2) rating = PerformerType.needHelp;
  return rating
}
