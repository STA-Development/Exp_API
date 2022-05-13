import { SubmissionState } from '../../enums/subMissionState';

export interface ISubmission {
  submissionState: SubmissionState;
  eventTitle: string;
  evaluatorFirstName: string;
  evaluatorLastName: string;
  evaluatorPosition: string;
  evaluateeFirstName: string;
  evaluateeLastName: string;
  evaluateePosition: string;
}
