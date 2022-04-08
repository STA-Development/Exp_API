import {Event} from "../entity/event";
import {SubCriteria} from "../entity/subCriteria";
import {User} from "../../users/entity/user";

export interface ICriteria {
  name: string;
  criteria: boolean;
  rating: number;
  events: Event[];
  subCriteria: SubCriteria[];
  users: User[];
}
