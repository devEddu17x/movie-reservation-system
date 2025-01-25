import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from '../services/reservation.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MakeReservationDTO } from '../dtos/make-reservation.dto';
import { BlockSeatsDto } from '../dtos/block-seats.dto';

@Controller('reservation')
@UseGuards(JwtAuthGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}
  @Post()
  async makeReservation(
    @Body() makeReservation: MakeReservationDTO,
    @Request() req: Request,
  ) {
    throw new HttpException(
      'This endpoint is not implemented yet',
      HttpStatus.NOT_IMPLEMENTED,
    );
  }
  @Post('block')
  async reserveSeatsForUpcomingReservation(
    @Body() seatsToBlock: BlockSeatsDto,
    @Request() req,
  ) {
    const reservedSeats =
      await this.reservationService.blockSeatsForUpcomingReservation(
        seatsToBlock,
        req.user.id,
      );

    if (!reservedSeats) {
      throw new NotFoundException('Seats not found');
    }

    return {
      message: 'Seats blocked for reservation',
      reservedSeats,
    };
  }
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
