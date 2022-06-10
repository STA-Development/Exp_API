import { ApiProperty } from '@nestjs/swagger';
import { IMyEvents } from '../interface/myEventsInterface';
import { EventStatus } from '../../enums/eventStatus';

export class MyEventsGetDto implements IMyEvents {
  @ApiProperty()
  status: EventStatus;

  @ApiProperty()
  title: string;

  @ApiProperty()
  startsAt: Date;
}
