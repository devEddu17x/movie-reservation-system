import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThanOrEqual, Repository } from 'typeorm';
import { SeatLock } from '../entities/seat-lock.entity';
import { Seat } from 'src/room/entities/seat.entity';

@Injectable()
export class SeatLockService {
  constructor(
    @InjectRepository(SeatLock)
    private readonly seatLockRepository: Repository<SeatLock>,
  ) {}

  async getBlockedFromUser(userId: string): Promise<Seat[]> {
    const seats = await this.seatLockRepository
      .createQueryBuilder('seatLock')
      .innerJoin('seatLock.seat', 'seat')
      .where('seatLock.lockUntil > :now', { now: new Date() })
      .andWhere('seatLock.userId = :userId', { userId })
      .select([
        'seat.id AS id',
        'seat.column_letter AS columnLetter',
        'seat.row_number AS rowNumber',
      ])
      .getRawMany();

    return seats;
  }

  async getBlocked(seats: number[]): Promise<SeatLock[]> {
    return await this.seatLockRepository.find({
      where: {
        lockUntil: MoreThanOrEqual(new Date()),
        seat: In(seats),
      },
    });
  }
}
