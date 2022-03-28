import {Criteria} from "../entity/criteria";

export interface ISubCriteria {
  id: number;
  name: string;
  subCriteria: boolean;
  criteria: Criteria;

}
