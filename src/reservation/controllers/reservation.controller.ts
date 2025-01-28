import {
  Body,
  Controller,
  Get,
  HttpCode,
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
    @Body() makeReservationDTO: MakeReservationDTO,
    @Request() req: Request,
  ) {
    const reservation = await this.reservationService.makeReservation(
      makeReservationDTO,
      (req as any).user.id,
    );

    if (!reservation) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      message: 'Reservation made',
      reservation: { ...reservation, seatsToPay: reservation.seats },
    };
  }
  @HttpCode(HttpStatus.OK)
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

  @HttpCode(HttpStatus.OK)
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
