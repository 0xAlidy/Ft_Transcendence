import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column({ default: '' })
  nickname: string;

  @Column({ default: 0 })
  xp: number;

  @Column({ default: 0 })
  lvl: number;

  @Column({ default: 0 })
  numberOfWin: number;

  @Column({ default: 0 })
  numberOfLoose: number;

  @Column("text",{ array:true, default: []})
  waitingFriends: string[];

  @Column("text",{ array:true, default: []})
  friends: string[];

  @Column("text",{ array:true, default: []})
  blockedUsers: string[];

  @Column("text",{ array:true, default: ['general']})
  rooms: string[];

  @Column()
  token: string;

  @Column({default: 'null'})
  WSId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 'null' })
  secret: string;

  @Column({ default: false })
  secretEnabled: boolean;

  @Column({ default: true })
  firstConnection: boolean;

  @Column({ default: 'null' })
  imgUrl: string;


  constructor(login: string, token: string){
    this.login = login;
    this.token = token;
  }
}