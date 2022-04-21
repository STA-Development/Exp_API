import {IsString, IsBoolean, IsNumber} from 'class-validator'

export class CreateCriteriaDto {
  @IsString()
  readonly name: string

  @IsBoolean()
  readonly criteria: boolean

  @IsNumber()
  readonly rating: number
}
