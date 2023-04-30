import {StatisticsDto} from '@apollusia/types';
import {Controller, Get} from '@nestjs/common';

import {StatisticsService} from './statistics.service';

@Controller('stats')
export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) {
    }

    @Get()
    async getStats(): Promise<StatisticsDto> {
        return this.statisticsService.getStats();
    }
}
