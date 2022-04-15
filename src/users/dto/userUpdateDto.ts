import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './userCreateDto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
