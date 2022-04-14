import {PartialType} from '@nestjs/mapped-types';
import {CreateEventDto} from './eventCreateDto';

export class UpdateEventDto extends PartialType(CreateEventDto) {}
