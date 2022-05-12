import { ApiProperty } from '@nestjs/swagger';
import { ISubmission } from '../interface/submissionInterface';
import { SubmissionState } from '../../enums/subMissionState';

export class SubmissionGetDto implements ISubmission {
  @ApiProperty()
  readonly eventTitle: string;

  @ApiProperty()
  readonly evaluateeFirstName: string;

  @ApiProperty()
  readonly evaluateeLastName: string;

  @ApiProperty()
  readonly evaluateePosition: string;

  @ApiProperty()
  readonly evaluatorFirstName: string;

  @ApiProperty()
  readonly evaluatorLastName: string;

  @ApiProperty()
  readonly evaluatorPosition: string;

  @ApiProperty({ enum: SubmissionState, enumName: 'submissionState' })
  readonly submissionState: SubmissionState;
}
