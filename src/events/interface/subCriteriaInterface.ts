import {Criteria} from "../entity/criteria";

export interface ISubCriteria {
  id: number;
  name: string;
  state: boolean;
  criteria: Criteria;

}
