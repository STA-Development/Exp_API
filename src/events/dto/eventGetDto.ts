import { Event } from "../entity/event";
import {ratingGetDto} from "./ratingGetDto";
import {userGetDto} from "../../users/dto/userGetDto";
import {criteriaGetDto} from "./criteriaGetDto";
export const eventGetDto = (event: Event): Event => {
 // console.log(`This is our eventDto`, Boolean(event.criteria))
  return ({
    id: event.id,
    title: event.title,
    bonus: event.bonus,
    rating: ((!event.rating || !event.rating.length) ? event.rating : event.rating.map(rating => ratingGetDto(rating))),
    TimePeriod: event.TimePeriod,
    users: ((!event.users || !event.users.length) ? event.users : event.users.map(user => userGetDto(user))),
    criteria: ((!event.criteria || !event.criteria.length) ? event.criteria : event.criteria.map(criteria => criteriaGetDto(criteria))),
    createdAt: event.createdAt,
    endsAt: event.endsAt,
  });
};
