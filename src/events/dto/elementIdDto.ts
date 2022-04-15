import { IsInt } from 'class-validator';
import { IIdRefDto } from '../interface/idRefInterface';

export class elementIdDto implements IIdRefDto {
  @IsInt()
  readonly id: number;
}
