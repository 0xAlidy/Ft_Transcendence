import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  nickname: string;

  @Column()
  xp: number;

  @Column()
  lvl: number;

  @Column()
  token: string;

  @Column({ default: true })
  isActive: boolean;
}
