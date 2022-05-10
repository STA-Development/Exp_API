import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger'
import {IsBoolean, IsString} from 'class-validator'

export class UpdateCriteriaDto {
  @ApiPropertyOptional()
  @IsString()
  readonly name: string

  @ApiProperty()
  @IsBoolean()
  readonly criteria: boolean
}
