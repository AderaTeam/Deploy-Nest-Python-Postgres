import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from 'src/dtos/user.dto';
import { UserSigninDto } from 'src/dtos/userSignin.dto';
import { UserUpdateDto } from 'src/dtos/userUpdate.dto';

@Controller('user')
export class UserController
{
    constructor(
        private readonly userService: UserService
    ){}
    
    @Get()
    public async getAll()
    {
        return await this.userService.getAll()
    }

    @Get(':id')
    public async getOneById(@Param('id')userid)
    {
        return await this.userService.getOneById(userid)
    }
    @Post()
    public async createOne(@Body() userDto: UserDto)
    {
        return await this.userService.signup(userDto)
    }

    @Post('signin')
    public async signin(@Body() userDto: UserSigninDto)
    {
        return await this.userService.signin(userDto)
    }

    @Post(':id')
    public async updateOne(@Param('id') userid: number, @Body() userDto: UserUpdateDto)
    {
        return await this.userService.updateOne(userDto, userid)
    }

    @Delete(':id')
    public async deleteOne(@Param('id') userid)
    {
        return await this.userService.deleteOne(userid)
    }
}
