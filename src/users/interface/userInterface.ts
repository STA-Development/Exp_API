import { Event } from "../../events/entity/event";

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  authUid: string;
  isAdmin: boolean;
  salary: number;
  avatar: string;
  avatarPublicId: string;
  events: Event[];
}
