import { Entity, Column } from 'typeorm';
import { Msg } from '../ChatRooms/Msg.dto';



@Entity()
export class PrivRoom {

    @Column()
    me:string;


    @Column()
    other:string;

    @Column('jsonb',{ default: []})
    messages: Msg[];

    constructor(me:string, other:string){
        this.me = me;
        this.other = other;
    }
}

