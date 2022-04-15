import { User, UserPivot } from '../entity/user';
import { pivotGetDto } from '../../events/dto/pivotGetDto';

export const userGetDto = (user: User): UserPivot => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    rating: user.rating,
    performerType: user.performerType,
    password: user.password,
    pivot: user?.pivot?.length
      ? user.pivot.map((pivot) => pivotGetDto(pivot))
      : [],
    isAdmin: user.isAdmin,
    salary: user.salary,
    avatar: user.avatar,
    avatarPublicId: user.avatarPublicId,
    events: user.events
  };
};
