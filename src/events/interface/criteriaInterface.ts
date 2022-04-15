import { Pivot } from "../entity/pivot";

export interface ICriteria {
  name: string;
  criteria: boolean;
  rating: number;
  pivot: Pivot[];
}
