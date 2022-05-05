import {IsString, IsBoolean} from 'class-validator'

export class CreateCriteriaDto {
  @IsString()
  readonly name: string

  @IsBoolean()
  readonly criteria: boolean
}
