import { Body, Controller, Post } from '@nestjs/common';
import { TestService } from './test.service';
import { Reflector } from '@nestjs/core';
import { UserJwt } from 'src/user/user.decorator';

@Controller('test')
export class TestController {
    constructor(
        private testService: TestService,
    ){}

    @Post()
    public async analyseTest(@Body() testData: Record<string, any>, @UserJwt() jwt: string)
    {   
        return this.testService.processData(testData.answers, jwt);
    }
}
