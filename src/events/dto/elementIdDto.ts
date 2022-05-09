import {IsInt} from 'class-validator'
import {IElementIdDto} from '../interface/idRefInterface'

export class elementIdDto implements IElementIdDto {
  @IsInt()
  readonly id: number
}
