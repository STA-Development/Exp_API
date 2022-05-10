export interface IEvaluationResult {
  Results: {
    [key: number]: boolean
  }
  evaluateeId: number
  token: string
}
