export class Room{
	id: number;
	name: string;
	password: string;
	userList: Array<string>;

	constructor({name = "", id = 0, creator = "", password = ""}){
        this.name = name;
       	this.id = id;
		this.password = password;
		this.userList =[creator];
		this.userList = [];
    }
}