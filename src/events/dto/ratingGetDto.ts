import { Rating } from "../entity/rating";
import {eventGetDto} from "./eventGetDto";

export const ratingGetDto = (rating: Rating): Rating => {
 //   console.log(`This is our ratingDto`)
    return ({
        id: rating.id,
        from: rating.from,
        to: rating.to,
        isSelected: rating.isSelected,
        events: ((!rating.events || !rating.events.length) ? rating.events : rating.events.map(event => eventGetDto(event))),
    });
};
