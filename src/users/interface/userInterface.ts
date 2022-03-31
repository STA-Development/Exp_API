import { Event } from "../../events/entity/event";

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  salary: number;
  avatar: string;
  avatar_public_id: string;
  events: Event[];
}
