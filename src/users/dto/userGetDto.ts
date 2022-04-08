import { User } from "../entity/user";
import {eventGetDto} from "../../events/dto/eventGetDto";
import {criteriaGetDto} from "../../events/dto/criteriaGetDto";

export const userGetDto = (user: User): User => {
  return ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    rating: user.rating,
    performerType: user.performerType,
    events: user?.events?.length ? user.events.map(event => eventGetDto(event)) : [],
    criteria: user?.criteria?.length ? user.criteria.map(criteria => criteriaGetDto(criteria)) : [],
  });
};
