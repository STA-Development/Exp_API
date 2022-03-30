import { Event } from "../../events/entity/event";

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  events: Event[];
}
