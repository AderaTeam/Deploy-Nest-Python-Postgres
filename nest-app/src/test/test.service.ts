import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserUpdateDto } from 'src/dtos/userUpdate.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TestService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService
    ){}
    
    public async processData(data: Record<string, any>, jwt: string)
    {
        let result ={
            "rational": 0,
            "unrational": 0,
            "trusting": 0,
            "untrusting": 0
        }
        let answers = {}
        for (const value in data)
        {
            for (const trait in answers[value])
            {
                result[trait] += 1/(answers[value].length)
            }
        }
        const type = Object.keys(result).reduce((a, b) => result[a] > result[b] ? a : b);

        const userid = this.jwtService.verify(jwt).id

        return this.userService.updateOne({type: type} as UserUpdateDto, userid)
    }   
}
