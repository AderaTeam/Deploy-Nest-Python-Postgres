import { Controller, Get } from '@nestjs/common';

@Controller('analysis')
export class AnalysisController {

    @Get(':id')
    public async personalAnalysis()
    {

    }
}
