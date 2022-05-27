import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Validate } from 'class-validator';
import { IEvaluationResult } from '../interface/evaluationResultInterface';
import { IsKeyValueValidate } from '../../utils/keyValueValidation';

export class EvaluationResultRequestDto implements IEvaluationResult {
  @ApiProperty({
    type: 'object',
    properties: { subCriteriaId: { type: 'number' } }
  })
  @Validate(IsKeyValueValidate)
  results: {
    [key: number]: number;
  };

  @ApiProperty()
  @IsInt()
  evaluateeId: number;

  @ApiProperty()
  @IsString()
  token: string;
}
