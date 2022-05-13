import { ApiProperty } from '@nestjs/swagger';
import { IPerformanceReport } from '../interface/performanceReportInterface';
import { PerformerType } from '../../enums/performerType';

export class PerformanceReportGetDto implements IPerformanceReport {
  @ApiProperty()
  eventTitle: string;

  @ApiProperty()
  eventStartsAt: Date;

  @ApiProperty()
  criteria: string;

  @ApiProperty()
  criteriaScore: number;

  @ApiProperty({ enum: PerformerType, enumName: 'performerType' })
  performerType: PerformerType;

  @ApiProperty()
  evaluatorFirstName: string;

  @ApiProperty()
  evaluatorLastName: string;

  @ApiProperty()
  evaluatorPosition: string;

  @ApiProperty()
  evaluateeFirstName: string;

  @ApiProperty()
  evaluateeLastName: string;

  @ApiProperty()
  evaluateePosition: string;
}
