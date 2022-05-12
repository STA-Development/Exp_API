import { ApiProperty } from '@nestjs/swagger';
import { SubmissionState } from '../interface/submissionInterface';

export class SubmissionGetDto {
  @ApiProperty()
  readonly eventTitle: string;

  @ApiProperty()
  readonly evaluateeFirstName: string;

  @ApiProperty()
  readonly evaluateeLastName: number;

  @ApiProperty()
  readonly evaluateePosition: number;

  @ApiProperty()
  readonly evaluatorFirstName: string;

  @ApiProperty()
  readonly evaluatorLastName: number;

  @ApiProperty()
  readonly evaluatorPosition: number;

  @ApiProperty({ enum: SubmissionState, enumName: 'submissionState' })
  readonly submissionState: SubmissionState;
}
