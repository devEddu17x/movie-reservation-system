import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ShowtimeService } from '../services/showtime.service';
import { CreateShowtimeDto } from '../dtos/create-showtime.dto';
import { RolesGuard } from 'src/core/shared/guards/roles.guard';
import { Roles } from 'src/core/shared/decorators/roles.decorator';
import { RoleType } from 'src/user/enums/role-type.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.ADMIN)
@Controller('showtime')
export class ShowtimeController {
  constructor(private readonly showtimeService: ShowtimeService) {}

  @Post()
  async createShowtime(@Body() createShowtimeDTO: CreateShowtimeDto) {
    const showtime =
      await this.showtimeService.createShowtime(createShowtimeDTO);
    return { message: 'Showtime created', showtime };
  }

  @Get()
  async getShowtimes() {
    const showtimes = await this.showtimeService.getShowtimes();
    if (showtimes?.length === 0) {
      throw new NotFoundException('Showtimes not found');
    }
    return showtimes;
  }
  @Get(':id')
  async getShowtime(@Param('id', ParseUUIDPipe) showtimeId: string) {
    const showtime = await this.showtimeService.getShowtime(showtimeId);
    if (!showtime) {
      throw new NotFoundException('Showtime not found');
    }
    return showtime;
  }
}
