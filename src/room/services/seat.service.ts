import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Seat } from '../entities/seat.entity';
import { ReservationStatus } from 'src/reservation/enums/showtime-status.enum';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
  ) {}

  /**
   * Retrieves all seats associated with a specific room.
   *
   * @param roomId - The unique identifier of the room to get seats from
   * @returns A Promise that resolves to an array of Seat entities
   * @throws HttpException with status 500 if database query fails
   */
  async getSeats(roomId: number): Promise<Seat[]> {
    try {
      return this.seatRepository.find({
        where: { room: { id: roomId } },
      });
    } catch (error) {
      throw new HttpException('Something went wrong', 500);
    }
  }

  async getSeatsReservedForShowtime(showtimeId: string): Promise<Seat[]> {
    return await this.seatRepository
      .createQueryBuilder('seat')
      .innerJoin('reservation_seat', 'rs', 'rs.seat_id = seat.id')
      .innerJoin('reservation', 'r', 'r.id = rs.reservation_id')
      .where('r.showtime_id = :showtimeId', { showtimeId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('r.status = :confirmedStatus', {
            confirmedStatus: ReservationStatus.CONFIRMED,
          }).orWhere(
            // Only include pending reservations that are less than 5 minutes old
            "r.status = :pendingStatus AND (NOW() - r.created_at) < INTERVAL '5 minutes'.",
            {
              pendingStatus: ReservationStatus.PENDING,
            },
          );
        }),
      )
      .getMany();
  }
}
