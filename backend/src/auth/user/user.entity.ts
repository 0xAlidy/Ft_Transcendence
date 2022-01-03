import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: '' })
  nickname: string;

  @Column({ default: 0 })
  xp: number;

  @Column({ default: 0 })
  lvl: number;

  @Column()
  token: string;

  @Column({ default: true })
  isActive: boolean;
  constructor(pseudo :string, token:string){
    this.name = pseudo;
    this.token = token;
  }
}
