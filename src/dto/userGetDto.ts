import { User } from "../entity/user";

export const UserGetDto = (user: User): User => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  events: user.events,
});
