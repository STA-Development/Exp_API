import { IEstimation } from './estimationInterface';

export interface IEvaluationResult extends IEstimation {
  evaluateeId: number;
  token: string; // todo IEstimation
}
