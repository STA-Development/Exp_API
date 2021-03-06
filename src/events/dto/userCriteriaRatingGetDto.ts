import { ApiProperty } from '@nestjs/swagger';

export class UserCriteriaRatingGetDto {
  @ApiProperty()
  readonly firstName: string;

  @ApiProperty()
  readonly lastName: string;

  @ApiProperty()
  readonly evaluateeId: number;

  @ApiProperty()
  readonly position: string;

  @ApiProperty()
  readonly eventId: number;

  @ApiProperty()
  readonly criteriaRating: number;
}
