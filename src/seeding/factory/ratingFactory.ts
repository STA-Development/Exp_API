import {define} from 'typeorm-seeding';

import {Rating} from '../../events/entity/rating';

define(Rating, () => {
  const rating = new Rating();
  rating.from = 1;
  rating.to = 0;
  rating.isSelected = 0;
  return rating;
});
