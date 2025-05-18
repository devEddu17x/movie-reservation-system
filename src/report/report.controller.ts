import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ReportService } from './report.service';
import { UseAdminGuard } from 'src/core/shared/decorators/protected.decorator';

@Controller('report')
@UseAdminGuard()
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
  @Get('movies')
  async reservationsForEachMovie(
    @Query('days', ParseIntPipe) daysCriteria: number = 30,
  ) {
    const reservations =
      await this.reportService.reservationForEachMovie(daysCriteria);
    return reservations;
  }
}
