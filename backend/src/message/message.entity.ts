import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sender: string;

  @Column()
  dest:string;

  @Column()
  message:string;

  @Column()
  date:string;

  constructor(sender :string, dest:string, message:string, date:string){
    this.sender = sender;
    this.dest = dest;
    this.message = message;
    this.date = date;
  }
}
