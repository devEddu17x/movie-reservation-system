import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Reservation } from '../entities/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SeatLock } from '../entities/seat-lock.entity';
import { MakeReservationDTO } from '../dtos/make-reservation.dto';
import { RoomService } from 'src/room/services/room.service';
import { SeatService } from 'src/room/services/seat.service';
import { BlockSeatsDto } from '../dtos/block-seats.dto';
import { getDatePlusFiveMinutes } from 'src/utils/plus-five-minutes';
import { SeatLockService } from './seat-lock.service';
import { ShowtimeService } from 'src/showtime/services/showtime.service';
import { ReservationStatus } from '../enums/showtime-status.enum';

@Injectable()
export class ReservationService {
  constructor(
    // repositories
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    // services
    private readonly roomService: RoomService,
    private readonly seatService: SeatService,
    private readonly seatLockService: SeatLockService,
    private readonly showtimeService: ShowtimeService,
    // to run transactions
    private readonly dataSource: DataSource,
  ) {}

  async makeReservation(
    makeReservationDTO: MakeReservationDTO,
    userId: string,
  ): Promise<Reservation> {
    const [seatsBlockedFromUser, showtime] = await Promise.all([
      this.seatLockService.getBlockedFromUser(userId),
      this.showtimeService.getShowtime(makeReservationDTO.showtimeId),
    ]);

    if (!showtime) {
      throw new NotFoundException('Showtime not found');
    }
    if (!seatsBlockedFromUser || seatsBlockedFromUser.length === 0) {
      throw new HttpException(
        'No seats blocked for user found. User needs to block seats, them will be reserved',
        404,
      );
    }

    const totalPrice = showtime.seatPrice * seatsBlockedFromUser.length;
    // calculate total price
    const reservation = {
      seats: seatsBlockedFromUser,
      totalPrice,
      user: { id: userId },
      showtime: { id: makeReservationDTO.showtimeId },
      status: ReservationStatus.PENDING,
    };
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const savedReservation = await queryRunner.manager.save(
        Reservation,
        reservation,
      );
      // delete blocked seats from user
      await queryRunner.manager.delete(SeatLock, {
        userId,
      });
      await queryRunner.commitTransaction();
      return savedReservation;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async blockSeatsForUpcomingReservation(
    seatsToReserve: BlockSeatsDto,
    userId: string,
  ): Promise<SeatLock[]> {
    // get seats that are currently blocked and seats in room provided
    const [blockedSeats, roomWithShowtimes, seatsInRoom] = await Promise.all([
      await this.seatLockService.getBlocked(seatsToReserve.seats),
      await this.roomService.getRoomWithShowtimes(seatsToReserve.roomId),
      await this.seatService.getSeats(seatsToReserve.roomId),
    ]);

    // check if some seats are already blocked by another user
    if (blockedSeats.length !== 0) {
      throw new HttpException(
        'Some seats are currently being blocked by another user',
        409,
      );
    }

    // check if room exists
    if (!roomWithShowtimes) {
      throw new HttpException(
        `Room with id [${seatsToReserve.roomId}] not found`,
        404,
      );
    }

    // check if is there any showtime in room
    if (!roomWithShowtimes.showtimes) {
      throw new HttpException('No showtimes found in room', 404);
    }
    // check if room includes showtime that user wants to reserve
    if (
      !roomWithShowtimes.showtimes
        .map((showtime) => showtime.id)
        .includes(seatsToReserve.showtimeId)
    ) {
      throw new HttpException(
        `Showtime with id [${seatsToReserve.showtimeId}] not found in room`,
        404,
      );
    }
    // check if the seats selected are valid (exist in room)
    const seatsIds = seatsInRoom.map((seat) => seat.id);
    if (seatsToReserve.seats.some((seatId) => !seatsIds.includes(seatId))) {
      throw new HttpException(
        'There is one or more seats that does not existis in room',
        400,
      );
    }

    // get seats reserved for showtime
    const reservedSeats = await this.seatService.getSeatsReservedForShowtime(
      seatsToReserve.showtimeId,
    );
    // check if some seats are already reserved from other users
    if (
      reservedSeats
        .map((seat) => seat.id)
        .some((seatId) => seatsToReserve.seats.includes(seatId))
    ) {
      throw new HttpException('Some seats are already reserved', 409);
    }

    // start transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const lockUntil = getDatePlusFiveMinutes();
    const seatsToBlock = seatsToReserve.seats.map((seatId) => ({
      seatId,
      showtimeId: seatsToReserve.showtimeId,
      userId,
      lockUntil,
    }));

    try {
      const seatsBlocked = await queryRunner.manager.save(
        SeatLock,
        seatsToBlock,
      );
      await queryRunner.commitTransaction();
      return seatsBlocked;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async cancelReservation() {}
  async getReservation(id: string): Promise<Reservation | null> {
    try {
      return this.reservationRepository.findOne({ where: { id } });
    } catch (error) {
      throw new HttpException('Something went wrong', 500);
    }
  }
  async getReservationsFromUser(userId: string): Promise<Reservation[] | null> {
    try {
      return this.reservationRepository.find({
        where: { user: { id: userId } },
      });
    } catch (error) {
      throw new HttpException('Something went wrong', 500);
    }
  }
}
