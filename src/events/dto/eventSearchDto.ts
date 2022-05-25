import { ApiPropertyOptional } from '@nestjs/swagger';
import { IEventSearch } from "../interface/eventSearchInterface";
import { Period } from "../../enums/eventPeriod";
import { IsOptional } from "class-validator";

export class EventSearchDto implements IEventSearch{
  @ApiPropertyOptional()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  bonus?: number;

  @ApiPropertyOptional()
  @IsOptional()
  period?: Period;
}
