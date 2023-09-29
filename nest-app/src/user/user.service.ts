import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { UserDto } from 'src/dtos/user.dto';
import { UserResponseDto } from 'src/dtos/userResponse.dto';
import { UserSigninDto } from 'src/dtos/userSignin.dto';
import { UserUpdateDto } from 'src/dtos/userUpdate.dto';

@Injectable()
export class UserService {
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ){}

    public async signup(userDto: UserDto)
    {
        
        const salt = 10
        const hash = await bcrypt.hash(userDto.password, salt)
        if (await this.userRepository.findOne({where:{email: userDto.email}}))
        {
            console.log (await this.userRepository.findOne({where:{email: userDto.email}}))
            throw new BadRequestException("User with this email already exists")
        }
        const currentUser = this.userRepository.create({email: userDto.email, password: hash, username: userDto.username, role: userDto.role})
        await this.userRepository.insert(currentUser)
        const payload = {id: currentUser.id, email: currentUser.email}
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: new UserResponseDto(currentUser)
        };
    }

    public async signin(signinDto: UserSigninDto)
    {
        const candidate = await this.userRepository.findOne({where:{email: signinDto.email}})
        if (!candidate)
        {
            throw new BadRequestException('User with that email not found')
        }
        if (!bcrypt.compare(signinDto.password, candidate.password))
        {
            throw new BadRequestException('Wrong password')
        }
        const payload = {id: candidate.id, email: candidate.email}
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: new UserResponseDto(candidate)
        };    
    }

    public async getOneById(id: number)
    {
        return new UserResponseDto(await this.userRepository.findOne({where:{id: id}}))
    }

    public async getOneByJwt(jwt: string)
    {
        const userData = this.jwtService.verify(jwt)

        return new UserResponseDto(await this.userRepository.findOne({where:{id: userData.id}}))
    }

    public async getAll()
    {
        const users = await this.userRepository.find()
        const newUsers: UserResponseDto[] = [] 
        for (const user of users)
        {
            newUsers.push(new UserResponseDto(user))
        }
        return newUsers
    }

    public async updateOne(userDto: UserUpdateDto, userid: number)
    {
        return await this.userRepository.update(userid, userDto)
    }

    public async deleteOne(id: number)
    {
        return await this.userRepository.delete(id)
    }


}
