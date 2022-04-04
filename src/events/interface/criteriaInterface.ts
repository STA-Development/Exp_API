import {Event} from "../entity/event";
import {SubCriteria} from "../entity/subCriteria";

export interface ICriteria {
  // id: number;
  name: string;
  criteria: boolean;
  events: Event[];
  subCriteria: SubCriteria[];
}
