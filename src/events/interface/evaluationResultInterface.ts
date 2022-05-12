export interface IEvaluationResult {
  results: {
    [key: number]: number;
  };
  evaluateeId: number;
  token: string;
}
