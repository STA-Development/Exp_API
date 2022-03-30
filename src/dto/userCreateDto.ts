import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly firstname: string;
  @IsString()
  readonly lastname: string;
  @IsString()
  readonly email: string;
  @IsString()
  password: string;





}
