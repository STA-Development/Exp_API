import { Pivot } from '../entity/pivot';

export interface ISubCriteria {
  id: number;
  name: string;
  result: boolean;
  pivot: Pivot[];
}
