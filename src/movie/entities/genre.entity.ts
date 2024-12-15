import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    unique: true,
    nullable: false,
    length: 16,
  })
  name: string;
}
