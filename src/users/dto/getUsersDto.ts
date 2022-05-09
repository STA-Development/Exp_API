import {ApiProperty} from '@nestjs/swagger'
import {User} from '../entity/user'

export class GetUserDto extends User {
  @ApiProperty()
  id: number

  @ApiProperty()
  firstName: string

  @ApiProperty()
  lastName: string

  @ApiProperty()
  email: string

  @ApiProperty()
  rating: number

  @ApiProperty()
  performerType: string

  @ApiProperty()
  authUid: string

  @ApiProperty()
  isAdmin: boolean

  @ApiProperty()
  salary: number

  @ApiProperty()
  avatar: string

  @ApiProperty()
  avatarPublicId: string

  @ApiProperty()
  position: string
}
