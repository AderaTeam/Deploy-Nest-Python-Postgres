import { Controller, Get, Param } from '@nestjs/common';
import { AnalysisService } from './analysis.service';

@Controller('analysis')
export class AnalysisController {
    constructor(
        private readonly analysisService: AnalysisService
    ){}

    @Get(':id')
    public async personalAnalysis(@Param('id') personId: number)
    {
        return this.analysisService.analyzeSingle(personId);
    }

    @Get()
    public async massAnalysis()
    {
        return this.analysisService.analyzeMass()
    }
}
