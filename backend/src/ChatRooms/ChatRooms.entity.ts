import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Msg } from './Msg.dto';



@Entity()
export class ChatRooms {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name:string;

  @Column()
  owner:string;

  @Column({default:''})
  password:string;

  @Column()
  IsPassword:boolean;

  @Column("text",{ array:true, default: []})
  blockedUsers: string[];

  @Column("text",{ array:true, default: []})
  users: string[];

  @Column('jsonb',{ default: []})
  messages: Msg[];

  constructor(name :string, owner:string, password:string|null){
    this.name = name;
    this.owner = owner;
    if( password === null)
      this.IsPassword = false;
    else{
      this.password = password;
      this.IsPassword = true;
    }
  }

  setPass = (newPass:string) =>{
    this.password = newPass;
  }
}
