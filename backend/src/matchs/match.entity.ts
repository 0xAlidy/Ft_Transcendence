import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  WinnerName:string;

  @Column()
  WinnerScore:number;

  @Column()
  LooserName:string;

  @Column()
  LooserScore:number;

  @Column()
  isArcade:boolean;
  constructor(WinnerName :string, WinnerScore:number, LooserName:string, LooserScore:number, isArcade:boolean){
    this.WinnerName = WinnerName;
    this.WinnerScore = WinnerScore;
    this.LooserName = LooserName;
    this.LooserScore = LooserScore;
    this.isArcade = isArcade;
  }
}
