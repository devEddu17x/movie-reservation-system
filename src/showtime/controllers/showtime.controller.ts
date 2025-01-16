import { Body, Controller, Post } from '@nestjs/common';
import { ShowtimeService } from '../services/showtime.service';
import { CreateShowtimeDto } from '../dtos/create-showtime.dto';

@Controller('showtime')
export class ShowtimeController {
  constructor(private readonly showtimeService: ShowtimeService) {}
  @Post()
  async createShowtime(@Body() createShowtimeDTO: CreateShowtimeDto) {
    await this.showtimeService.createShowtime(createShowtimeDTO);
    return { message: 'Showtime created' };
  }
}
