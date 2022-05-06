import { User } from '../entity/user';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserDto extends User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  performerType: string;

  @ApiProperty()
  authUid: string;

  @ApiProperty()
  isAdmin: boolean;

  @ApiProperty()
  salary: number;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  avatarPublicId: string;

  @ApiProperty()
  position: string;
}
