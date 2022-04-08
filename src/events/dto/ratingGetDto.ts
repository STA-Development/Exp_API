import { Rating } from "../entity/rating";
import {eventGetDto} from "./eventGetDto";

export const ratingGetDto = (rating: Rating): Rating => {
    return ({
        id: rating.id,
        from: rating.from,
        to: rating.to,
        isSelected: rating.isSelected,
        events: rating?.events?.length ? rating.events.map(event => eventGetDto(event)) : [],
    });
};
