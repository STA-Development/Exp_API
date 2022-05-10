import {ISubmission, SubmissionState} from '../events/interface/submissionInterface'

export const getSubmissions = (
  submissionModels: ISubmission[],
  submissionSubCriteria,
  eventSubCriteriaCount,
  eventTitle,
): ISubmission[] => {
  const submissions: ISubmission[] = []
  for (let i = 0; i < submissionModels.length; i++) {
    let submissionState
    eventSubCriteriaCount / submissionSubCriteria[i].count === 1
      ? (submissionState = SubmissionState.completed)
      : (submissionState = SubmissionState.partiallyCompleted)
    const submission: ISubmission = {
      eventTitle,
      evaluateeFirstName: submissionModels[i].evaluateeFirstName,
      evaluateeLastName: submissionModels[i].evaluateeLastName,
      evaluateePosition: submissionModels[i].evaluateePosition,
      evaluatorFirstName: submissionModels[i].evaluatorFirstName,
      evaluatorLastName: submissionModels[i].evaluatorLastName,
      evaluatorPosition: submissionModels[i].evaluatorPosition,
      submissionState,
    }
    submissions.push(submission)
  }
  return submissions
}
