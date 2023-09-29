import { Inject, Injectable } from '@nestjs/common';
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
        let answers = { 
        "0": {
            "0": ["Предприимчивый кролик"],
            "1": ["Открытый кролик:", "Осторожный кролик"],
            "2": ["Смелый кролик:"]
        },
        "1": {
            "0": ["Смелый кролик:"],
            "1": ["Открытый кролик:", "Осторожный кролик"],
            "2": ["Предприимчивый кролик"]
        },
        "2": {
            "0": ["Предприимчивый кролик"],
            "1": ["Смелый кролик:", "Осторожный кролик"],
            "2": ["Открытый кролик:"]
        },
        "3": {
            "0": ["Предприимчивый кролик", "Осторожный кролик"],
            "1": ["Смелый кролик:"],
            "2": ["Открытый кролик:"]
        },
        "4": {
            "0": ["Смелый кролик:", "Открытый кролик:"],
            "1": ["Осторожный кролик"],
            "2": ["Предприимчивый кролик"]
        },
        "5": {
            "0": ["Смелый кролик:", "Осторожный кролик"],
            "1": ["Предприимчивый кролик"],
            "2": ["Открытый кролик:"]
        },
        "6": {
            "0": ["Предприимчивый кролик"],
            "1": ["Осторожный кролик"],
            "2": ["Открытый кролик:", "Смелый кролик:"]
        },
        "7": {
            "0": ["Осторожный кролик"],
            "1": ["Предприимчивый кролик"],
            "2": ["Открытый кролик:", "Смелый кролик:"]
        },
        "8": {
            "0": ["Осторожный кролик"],
            "1": ["Предприимчивый кролик"],
            "2": ["Открытый кролик:", "Смелый кролик:"]
}
}
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
