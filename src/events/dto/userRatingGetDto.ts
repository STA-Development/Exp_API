import {ApiProperty} from '@nestjs/swagger'

export class UserRatingGetDto {
  @ApiProperty()
  readonly evaluateeId: number

  @ApiProperty()
  readonly rating: number
}
