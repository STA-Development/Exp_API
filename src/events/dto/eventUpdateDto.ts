import {PartialType} from '@nestjs/mapped-types'
import {CreateEventDto} from './eventCreateDto' //todo event update dto

export class UpdateEventDto extends PartialType(CreateEventDto) {}
