import { User } from "../entity/user";

export const UserGetDto = (user: User): User => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  authUid: user.authUid,
  email: user.email,
  isAdmin: user.isAdmin,
  salary: user.salary,
  avatar: user.avatar,
  avatarPublicId: user.avatarPublicId,
  events: user.events
});
