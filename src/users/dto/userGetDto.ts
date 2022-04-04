import { User } from "../entity/user";
import {eventGetDto} from "../../events/dto/eventGetDto";

export const userGetDto = (user: User): User => {
  return ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    events: ((!user.events || !user.events.length) ? user.events : user.events.map(event => eventGetDto(event))),

  });
};
