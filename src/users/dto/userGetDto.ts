import { User } from "../entity/user";

export const UserGetDto = (user: User): User => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  password: user.email,
  email: user.email,
  isAdmin: user.isAdmin,
  salary: user.salary,
  avatar: user.avatar,
  avatar_public_id: user.avatar_public_id,
  events: user.events
});
