import { Inject, Injectable, Logger } from '@nestjs/common';
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
            "Предприимчивый кролик": 0,
            "Смелый кролик": 0,
            "Открытый кролик": 0,
            "Осторожный кролик": 0
        }
        let answers = { 
        "0": {
            "0": ["Предприимчивый кролик"],
            "1": ["Открытый кролик", "Осторожный кролик"],
            "2": ["Смелый кролик"]
        },
        "1": {
            "0": ["Смелый кролик"],
            "1": ["Открытый кролик", "Осторожный кролик"],
            "2": ["Предприимчивый кролик"]
        },
        "2": {
            "0": ["Предприимчивый кролик"],
            "1": ["Смелый кролик", "Осторожный кролик"],
            "2": ["Открытый кролик"]
        },
        "3": {
            "0": ["Предприимчивый кролик", "Осторожный кролик"],
            "1": ["Смелый кролик"],
            "2": ["Открытый кролик"]
        },
        "4": {
            "0": ["Смелый кролик", "Открытый кролик"],
            "1": ["Осторожный кролик"],
            "2": ["Предприимчивый кролик"]
        },
        "5": {
            "0": ["Смелый кролик", "Осторожный кролик"],
            "1": ["Предприимчивый кролик"],
            "2": ["Открытый кролик"]
        },
        "6": {
            "0": ["Предприимчивый кролик"],
            "1": ["Осторожный кролик"],
            "2": ["Открытый кролик", "Смелый кролик"]
        },
        "7": {
            "0": ["Осторожный кролик"],
            "1": ["Предприимчивый кролик"],
            "2": ["Открытый кролик", "Смелый кролик"]
        },
        "8": {
            "0": ["Осторожный кролик"],
            "1": ["Предприимчивый кролик"],
            "2": ["Открытый кролик", "Смелый кролик"]
        }
        }
        for (const value in data)
        {
            answers[value][data[value]].forEach(trait => {
                result[trait] += 1/(answers[value][data[value]].length)
            });
        }
        const type = Object.keys(result).reduce((a, b) => result[a] > result[b] ? a : b);

        Logger.log(result)

        const userid = this.jwtService.verify(jwt).id

        await this.userService.updateOne({type: type} as UserUpdateDto, userid)

        return {user: await this.userService.getOneById(userid)}
    }   
    /**
     * 1) Частота вклада (месяц, год, день)
3) Желаемый размер ежемесячной пенсии
4) Возраст текущий
5) Возраст выхода на пенсию
6) Будет ли пенсия
7) Количество индивидуальных пенсионных балов (if 6==True)
* 7 - вариационный параметр, его можно не вводить, он существует для большей точности
     * 
     * 
     * 
     * 
     * 
     */
        
        public calcPension(data: {firstPayment: number, currentAge: number, sex: "male"|"female", payment?: number})
        {

                const paymentYears = (data.sex=="female" ? 55 : 60) - data.currentAge

                const amountOfPayments = paymentYears * 12

                let cash = amountOfPayments * data.payment + data.firstPayment * 1.1

                const percentCash = cash * 1.2 * (data.sex=="female" ? 0.8 : 1)

                const monthlyPayment = percentCash/ 30 * 12
                
                return {monthlyPayment: monthlyPayment, cash: cash, percentEarnings: percentCash - cash, allcash: percentCash}
        }

        public calcPayment(data: {wantedPension: number, paymentsPerYear: number, firstPayment: number, currentAge: number, sex: "male"|"female"})
        {
            const paymentYears = (data.sex=="female" ? 55 : 60) - data.currentAge

            const amountOfPayments = paymentYears * data.paymentsPerYear

            const percentCash = data.wantedPension * 30 * 12 * 0.8 * (data.sex=="female" ? 1 : 1.2)


            const monthlyPayment = percentCash/amountOfPayments

            const cash = amountOfPayments * monthlyPayment

            return {monthlyPayment: monthlyPayment, cash: cash, percentEarnings: percentCash - cash, allcash: percentCash}
        }
}
