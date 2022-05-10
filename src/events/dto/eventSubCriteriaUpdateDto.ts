import {ApiProperty} from '@nestjs/swagger'
import {IsInt} from 'class-validator'

export class EventSubCriteriaUpdateDto {
  @ApiProperty({type: 'array', items: {type: 'number'}})
  subCriteriaId: number[]

  @ApiProperty()
  @IsInt()
  userId: number
}
