import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entities/room.entity';
import { CreateRoomDto } from 'src/room/dto/create-room.dto';
import { Showtime } from 'src/showtime/entities/showtime.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
  ) {}

  async createRoom(roomDTO: CreateRoomDto): Promise<Room> {
    try {
      const room: Room = this.roomRepository.create(roomDTO);
      return await this.roomRepository.save(room);
    } catch (e) {
      if (e.code === '23505') {
        throw new HttpException('Room already exists', 409);
      }
      throw new HttpException('Something went wrong', 500);
    }
  }

  async getRoomWithShowtimes(
    roomId: number,
  ): Promise<Room & { showtimes?: Showtime[] }> {
    const [room, showtimes] = await Promise.all([
      await this.roomRepository.findOne({ where: { id: roomId } }),
      await this.getShowtimesInRoom(roomId),
    ]);

    if (!room) {
      throw new HttpException('Room not found', 404);
    }
    return showtimes.length > 0 ? { ...room, showtimes } : room;
  }

  async getRooms(): Promise<Room[]> {
    const rooms = await this.roomRepository.find();
    if (rooms.length === 0) {
      throw new HttpException('Rooms not found', 404);
    }
    return rooms;
  }
  async getRoomSeats(id: number): Promise<Room> {
    const room = await this.roomRepository.findOne({
      where: { id },
      relations: ['seats'],
    });
    if (!room) {
      throw new HttpException('Room not found', 404);
    }
    return room;
  }

  async getShowtimesInRoom(roomId: number): Promise<Showtime[]> {
    try {
      const showtimes = await this.showtimeRepository.find({
        where: { room: { id: roomId } },
        relations: ['movie'],
      });

      return showtimes;
    } catch (error) {
      throw new HttpException('Something went wrong', 500);
    }
  }
}
