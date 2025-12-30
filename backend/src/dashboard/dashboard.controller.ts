import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get dashboard summary' })
  getSummary() {
    return this.dashboardService.getSummary();
  }

  @Get('materials')
  @ApiOperation({ summary: 'Get materials summary' })
  getMaterialsSummary(@Query('unopened') unopened?: string) {
    return this.dashboardService.getMaterialsSummary(unopened === 'true');
  }
}
