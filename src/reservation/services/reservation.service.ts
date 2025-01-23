import { HttpException, Injectable } from '@nestjs/common';
import { DataSource, In, MoreThanOrEqual, Repository } from 'typeorm';
import { Reservation } from '../entities/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SeatLock } from '../entities/seat-lock.entity';
import { MakeReservationDTO } from '../dtos/make-reservation.dto';
import { RoomService } from 'src/room/services/room.service';
import { SeatService } from 'src/room/services/seat.service';

@Injectable()
export class ReservationService {
  constructor(
    // repositories
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(SeatLock)
    private readonly seatLockRepository: Repository<SeatLock>,
    // services
    private readonly roomService: RoomService,
    private readonly seatService: SeatService,

    // to run transactions
    private readonly dataSource: DataSource,
  ) {}
  async makeReservation(
    makeReservationDTO: MakeReservationDTO,
    userId: string,
  ) {
    /**
     * Get seats locks, room with showtimes and seats in room
     * NOTE:
     * this is helpful to check if some seat is blocked for an in coming reservation
     * and if the room exists and if the showtime exists in the room
     */
    const [seatLocks, roomWithShowtimes, seatsInRoom] = await Promise.all([
      await this.seatLockRepository.find({
        where: {
          seat: In(makeReservationDTO.seats),
          lockUntil: MoreThanOrEqual(new Date()),
        },
      }),
      await this.roomService.getRoomWithShowtimes(makeReservationDTO.roomId),
      await this.seatService.getSeats(makeReservationDTO.roomId),
    ]);

    // check if room exists
    if (!roomWithShowtimes) {
      throw new HttpException(
        `Room with id [${makeReservationDTO.roomId}] not found`,
        404,
      );
    }
    // check if showtime exists in room
    if (!roomWithShowtimes.showtimes) {
      throw new HttpException('No showtimes found in room', 404);
    }

    // check if some seat is blocked for an in coming reservation
    if (seatLocks.length > 0) {
      throw new HttpException(`Some seats are already reserved`, 409);
    }

    // check if room includes showtime that user wants to reserve
    if (
      !roomWithShowtimes.showtimes
        .map((showtime) => showtime.id)
        .includes(makeReservationDTO.showtimeId)
    ) {
      throw new HttpException(
        `Showtime with id [${makeReservationDTO.showtimeId}] not found in room`,
        404,
      );
    }

    // check if user selected some seats
    if (makeReservationDTO.seats.length === 0) {
      throw new HttpException('No seats selected', 400);
    }

    // check if the seats selected are not more than room owns
    if (makeReservationDTO.seats.length > seatsInRoom.length) {
      throw new HttpException('Invalid seat selection', 400);
    }

    // check if the seats selected are valid (exist in room)
    const seatsIds = seatsInRoom.map((seat) => seat.id);
    if (makeReservationDTO.seats.some((seatId) => !seatsIds.includes(seatId))) {
      throw new HttpException(
        'There is a seat that does not existis in room',
        400,
      );
    }

    // continue with verificaction of already reserved seats in entity ReservationSeats (entity not implemented yet)
    let seatsLock = makeReservationDTO.seats.map((seatId) => ({
      seatId,
      showtimeId: makeReservationDTO.showtimeId,
      userId,
    }));
    // starting transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // block seats are going to be reserved
      seatsLock = await queryRunner.manager.save(SeatLock, seatsLock);
      console.log(seatsLock);
      // queryRunner.manager.save(Reservation, {
      //   user: { id: userId },
      //   showtime: { id: makeReservationDTO.showtimeId },
      // });
    } catch (error) {
      queryRunner.rollbackTransaction();
      throw new HttpException('Something went wrong', 500);
    } finally {
      queryRunner.release();
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
