
export class Room{
	id: number;
	name: string;
	password: string;
	userList: Array<string>;
	adminList: Array<string>;

	constructor({name = "", id = 0, creator = "", password = ""}){
		if (name)
        	this.name = name;
		if (id != 0)
       		this.id = id;
		if (password)
			this.password = password;
		if (creator)
			this.userList =[creator];
		else
			this.userList = [];
    }
}