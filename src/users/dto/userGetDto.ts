import { User, UserDto } from '../entity/user';
import { userSubCriteriaGetDto } from '../../events/dto/userSubCriteriaGetDto';
import { eventGetDto } from '../../events/dto/eventGetDto';

export const userGetDto = (user: User): UserDto => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  rating: user.rating,
  performerType: user.performerType,
  authUid: user.authUid,
  userSubCriteria:
    user?.userSubCriteria &&
    user.userSubCriteria.map((userSubCriteria) =>
      userSubCriteriaGetDto(userSubCriteria)
    ),
  isAdmin: user.isAdmin,
  salary: user.salary,
  avatar: user.avatar,
  position: user.position,
  avatarPublicId: user.avatarPublicId,
  events: user?.events && user.events.map((event) => eventGetDto(event))
});
