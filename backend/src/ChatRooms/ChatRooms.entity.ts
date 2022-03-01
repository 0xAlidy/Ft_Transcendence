import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Msg } from './Msg.dto';
import {Mute} from './Mute.dto'

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

  @Column({default: false})
  IsPrivate:boolean;

  @Column('jsonb',{default:[]})
  muteList:Mute[];

  @Column("text",{ array:true, default: []})
  banUsers: string[];

  @Column("text",{ array:true, default: []})
  users: string[];

  @Column("text", {array: true, default: []})
  adminList: string[];

  @Column('jsonb',{ default: []})
  messages: Msg[];

  constructor(name :string | null, owner:string | null , password:string|null, priv:boolean, privUser:string[] | null){
    if (priv)
      this.IsPrivate = priv;
    if (priv === true)
    {
      this.owner = "";
      this.name = "-" + privUser[0] + " /" + privUser[1];
      this.IsPassword = false;
	  this.password = "";
      this.users = privUser
      this.adminList = privUser;
    }
    else {
      this.name = name;
      this.owner = owner;
      this.adminList= [this.owner];
      if( password === '')
        this.IsPassword = false;
      else{
        this.password = password;
        this.IsPassword = true;
      }
    }
  }

  // setPass = (newPass:string) =>{
  //   this.password = newPass;
  // }

  // findUser = (toFind:string) => {
  //   for(var i = 0; i < this.users.length; i++)
  //     if (this.users[i] === toFind)
  //       return true
  //   return false
  // }


  // banUser = (toBan:string) => {
  //   if (this.findUser(toBan) === true){
  //     this.blockedUsers.push(toBan);
  //     return (true)
  //   }
  //   else
  //     return false
  // }

  // unbanUser = (toUnban:string) => {
  //   var isBlock: boolean = false;
  //   for(var i = 0; i < this.users.length; i++)
  //   {
  //     if (this.users[i] === toUnban)
  //       isBlock = true
  //   }
  //   if (isBlock == false)
  //     return false
  //   else 
  //   {

  //   }
  // }

}
