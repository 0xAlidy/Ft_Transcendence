import { Msg } from 'src/ChatRooms/Msg.dto';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

class privRoom {
  user1:string;
  user2:string;
  // @Column('jsonb',{ default: []})
  messages: Msg[];
  constructor(user1:string, user2:string){
    this.user1 = user1;
    this.user2 = user2;
    }
}

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


  //privroom

  @Column("text", {array:true, default: []})
  privRoom:privRoom[];




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


  constructor(pseudo :string, token:string){
    this.name = pseudo;
    this.token = token;
  }
}