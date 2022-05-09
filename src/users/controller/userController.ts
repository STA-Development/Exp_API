import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import {ApiFile} from '../dto/uploadFileDto'
import {UsersService} from '../service/userService'
import {CreateUserDto} from '../dto/userCreateDto'
import {UpdateUserDto} from '../dto/userUpdateDto'
import {UserSalaryDto} from '../dto/userSalaryDto'
import {User, UserDto} from '../entity/user'
import {AuthGuard} from '../../middlewares/checkJwt'
import {RolesGuard} from '../../middlewares/checkAdmin'
import {Token} from '../../middlewares/jwtDecorator'
import {ApiBearerAuth, ApiOkResponse} from '@nestjs/swagger'
import {logger} from '../../logger'
import {userGetDto} from '../dto/userGetDto'
import {AddUserDto} from '../dto/addUserDto'
import {GetUserDto} from '../dto/getUsersDto'

@Controller('users')
export class UsersController {
  @Inject()
  usersService: UsersService

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({type: [GetUserDto]})
  @Get()
  async findAll(
    @Query('limit') limit: number,
    @Query('page') page: number,
  ): Promise<{pageCount: number; userList: UserDto[]}> {
    logger.info('Get all users')
    const users = await this.usersService.findAll(limit, page)
    const userList = users.data.map((user) => userGetDto(user))
    return {userList, pageCount: users.count}
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({type: GetUserDto})
  @Get('me')
  findOne(@Token() uid: string): Promise<User> {
    return this.usersService.findOne(uid)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOkResponse({type: GetUserDto})
  async find(@Param('id') id: number): Promise<UserDto> {
    return userGetDto(await this.usersService.findOneById(id))
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, updateUserDto)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: number): Promise<User> {
    return this.usersService.remove(id)
  }

  @Patch('avatar')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiFile()
  changeUserImg(
    @UploadedFile('file') file: Express.Multer.File,
    @Token() uid: string,
  ): Promise<User> {
    return this.usersService.uploadImageToCloudinary(file, uid)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch(':id/salary')
  changeSalary(@Body() userSalaryDto: UserSalaryDto, @Param('id') id: number): Promise<User> {
    return this.usersService.changeSalary(id, userSalaryDto)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch(':id/disabled')
  deactivateUser(@Param('id') id: number) {
    return this.usersService.userDeactivate(id)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('addUser')
  async addUser(@Body() addUserDto: AddUserDto): Promise<User> {
    return this.usersService.addUser(addUserDto)
  }
}
