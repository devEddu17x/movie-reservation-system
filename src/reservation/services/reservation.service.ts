import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Reservation } from '../entities/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SeatLock } from '../entities/seat-lock.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(SeatLock)
    private readonly seatLockRepository: Repository<SeatLock>,
  ) {}
  async makeReservation() {}
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
