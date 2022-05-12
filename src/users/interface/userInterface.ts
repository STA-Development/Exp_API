import { Event } from '../../events/entity/event';
import { UserSubCriteria } from '../../events/entity/userSubCriteria';

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  rating: number;
  authUid: string;
  performerType: string;
  userSubCriteria: UserSubCriteria[];
  isAdmin: boolean;
  salary: number;
  avatar: string;
  position: string;
  avatarPublicId: string;
  events: Event[];
}
