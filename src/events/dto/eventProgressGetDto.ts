import {ApiProperty} from '@nestjs/swagger'

export class EventProgressGetDto {
  @ApiProperty()
  readonly progressPercentage: number

  @ApiProperty()
  readonly title: string

  @ApiProperty()
  readonly stertDate: Date

  @ApiProperty()
  readonly endDate: Date
}
