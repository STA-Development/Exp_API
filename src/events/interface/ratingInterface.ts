import { Pivot } from "../entity/pivot";

export interface IRating {
  from: number;
  to: number;
  isSelected: number;
  pivot: Pivot[];
}
