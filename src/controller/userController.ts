import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    Inject,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from '../service/userService';
import { CreateUserDto } from '../dto/userCreateDto';
import { UpdateUserDto } from '../dto/userUpdateDto';
import { User } from '../entity/user';

@Controller('users')
export class UsersController {
    @Inject()
    usersService: UsersService;

    @UseInterceptors(ClassSerializerInterceptor)
    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.create(createUserDto);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    findAll(): Promise<Array<User>> {
        return this.usersService.findAll();
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
        return await this.usersService.findOne(id);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.usersService.update(id, updateUserDto);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Delete(':id')
    remove(@Param('id') id: string): Promise<User> {
        return this.usersService.remove(id);
    }
}
