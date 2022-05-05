import {IsBoolean, IsInt} from 'class-validator'

export class CreateRatingDto {
  @IsInt()
  readonly from: number

  @IsInt()
  readonly to: number

  @IsBoolean()
  readonly isSelected: boolean
}
