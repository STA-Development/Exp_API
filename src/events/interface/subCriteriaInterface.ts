import { Pivot } from "../entity/pivot";

export interface ISubCriteria {
  id: number;
  name: string;
  state: boolean;
  pivot: Pivot[];
}
