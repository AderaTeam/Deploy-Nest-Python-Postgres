import { Body, Controller, Post, Request } from '@nestjs/common';
import { TestService } from './test.service';
import { Reflector } from '@nestjs/core';

@Controller('test')
export class TestController {
    constructor(
        private testService: TestService,
    ){}
    @Post()
    public async analyseTest(@Body() testData: Record<string, any>, @Request() req: string)
    {   
        return this.testService.processData(testData.answers, req['user']);
    }
}
