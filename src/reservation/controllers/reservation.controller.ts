import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from '../services/reservation.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('reservation')
@UseGuards(JwtAuthGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}
  @Post()
  async makeReservation() {}
  @Post('cancel')
  async cancelReservation() {}
  @Get('user')
  async getReservationsFromUser(@Request() req) {
    const reservations = await this.reservationService.getReservationsFromUser(
      req.user.id,
    );
    if (!reservations) {
      throw new NotFoundException('Reservations from user not found');
    }
  }
  @Get(':id')
  async getReservation(@Param('id', ParseUUIDPipe) id: string) {
    const reservation = await this.reservationService.getReservation(id);
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }
}
