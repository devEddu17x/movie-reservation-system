import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Room } from '../entities/room.entity';
import { CreateRoomDto } from 'src/room/dto/create-room.dto';
import { UpdateRoomDTO } from '../dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
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

  async getRoom(roomId: number): Promise<Room> {
    return await this.roomRepository.findOne({ where: { id: roomId } });
  }

  async getRooms(): Promise<Room[]> {
    const rooms = await this.roomRepository.find();
    if (rooms.length === 0) {
      throw new HttpException('Rooms not found', 404);
    }
    return rooms;
  }

  async updateRoom(
    roomId: number,
    roomDTO: UpdateRoomDTO,
  ): Promise<UpdateResult> {
    const room = this.roomRepository.create(roomDTO);
    try {
      return await this.roomRepository.update(roomId, room);
    } catch (e) {
      throw new HttpException('Something went wrong', 500);
    }
  }
}
