export interface UserPublic{
    imgUrl: string;
    status: number; // 0 = disconnect, 1 = connect, 2 = game
    isFriend:number; // 0 = none, 1 = friend, 2 = waiting, 3 = blockMe
    lvl: number;
    nickname: string;
    login:string
    numberOfLose: number;
    numberOfWin: number;
    xp: number;
}