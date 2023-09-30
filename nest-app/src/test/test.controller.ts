import { Body, Controller, Post, Request, UnauthorizedException } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
    constructor(
        private testService: TestService,
    ){}
    @Post()
    public async analyseTest(@Body() testData: Record<string, any>, @Request() req)
    {   
        let user = ""
        try {
            user = req.headers['authorization'].split(' ')[1]
        } catch (e) {
            throw new UnauthorizedException("JWT empty")
        }
        return this.testService.processData(testData.answers, user);
    }
}
