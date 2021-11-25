class Store {

    roomList = []
    username = ""
	active_room = "general"
}

let store = new Store(); 

var chat_app = new Vue ({
    el: '#chat_app',
    methods: {

        sendUsername(){
            store.username = document.getElementById("username").value;
            console.log("hello " + store.username);
            this.socket.emit('newConnection', {username: store.username});
            document.getElementById("username").disabled = true;
            store.active_room = "general";
        },

        getRoomList(){
            this.socket.emit('getRoomList');
        },


        //   Select  //
        getSelect(){
            var select = document.getElementById("selectroom");
            for(var i = 1; i < store.roomList.length; i++){
                var opt = store.roomList[i].name;
                var el = document.createElement("option");
                el.textContent = opt;
                el.value = opt;
                if (this.room_exist(opt) == 0)
                    select.appendChild(el);
            }
            store.active_room = select.value
            console.log(store.active_room);
        },

        findId(name){
            for(var i = 0; i < store.roomList.length; i++){
                if (store.roomList[i].name === name)
                    return i;
            }
            return -1
        },

        checkPass(){
            var pass = document.getElementById("passRoom").value
            var select = document.getElementById("selectroom").value;
            id = this.findId(select);
            if (store.roomList[id] === pass)
                console.log("faut rejoindre mtn")
            else{
                console.log("faut aller ce faire encule mtn ")
            }
        },

        room_exist(name){
            var list = document.getElementById("selectroom");
            for(var i = 0; i < list.options.length; i++)
                if (list.options[i].value == name)
                    return 1;
            return 0;
        },

        //  join room  //

        joinRoom(){
            old = store.active_room;
            tojoin = document.getElementById("selectroom").value;

            if ( (id = this.findId(tojoin) === 1)){
                if (store.roomList[id].password)
                    openPassInput();
            }
            else
                return ;

            //montrer l input password si il y a un un mdp dans selected room 

            store.active_room = tojoin;
			this.socket.emit('joinRoom', {username:store.username, room:store.active_room, oldRoom: old})
			document.getElementById("tittle").value = tojoin;
        },


        addRoom(){
            var name = document.getElementById("inputNewRoom");
            var pass = document.getElementById("inputPassRoom");
            console.log(name.value);
            this.socket.emit('newRoom', {name: name.value, user: store.username, pass: pass.value})
        },

        showAddRoom() {
            var x = document.getElementById("addRoom");
            if (x.style.display === "none") {
              x.style.display = "block";
            } else {
              x.style.display = "none";
            }
        },

        sendChatMessage() {
            var msg = document.getElementById("text");
            console.log(msg.value);
            this.socket.emit('chatToServer', { sender: store.username, room: store.active_room, message: msg.value });
            msg.value = "";
        },

        receiveChatMessage(msg) {
            if(store.active_room == msg.room){
                var chatBox = document.getElementById("chatbox")
                var newMsg = document.createElement("li")
                if (store.username == msg.sender){
                    newMsg = this.myMsg(newMsg);
                    newMsg.appendChild(document.createTextNode(msg.message));
                }
                else if (msg.sender == "[system]"){
                    newMsg = this.sysMsg(newMsg);
                    newMsg.appendChild(document.createTextNode(msg.message));
                }
                else{
                    newMsg = this.otherMsg(newMsg);
                    newMsg.appendChild(document.createTextNode(msg.sender + ": " + msg.message));
                }
                chatBox.appendChild(newMsg)
            }
        },
        
        // defini le bon style pour le message
        otherMsg(newMsg){
            newMsg.style.backgroundColor = "#636363";
            newMsg.style.padding = "15px";
            newMsg.style.listStyleType = "none";
            newMsg.style.width = "fit-content";
            newMsg.style.borderRadius = "23px 23px 23px 0px";
            newMsg.style.marginBottom = "15px";
            newMsg.style.clear= "both"
            return newMsg;
        },
        myMsg(newMsg){
            newMsg.style.backgroundColor = "#edca00";
            newMsg.style.padding = "15px";
            newMsg.style.listStyleType = "none";
            newMsg.style.width = "fit-content";
            newMsg.style.borderRadius = "23px 23px 0px 23px";
            newMsg.style.marginBottom = "15px";
            newMsg.style.float = "right";
            newMsg.style.clear= "both"
            return newMsg;
        },
        sysMsg(newMsg){
            newMsg.style.padding = "15px";
            newMsg.style.listStyleType = "none";
            newMsg.style.width = "fit-content";
            newMsg.style.marginBottom = "10px";
            newMsg.style.alignItems = "center";
            newMsg.style.clear = "both"
            newMsg.style.color = "white";
            newMsg.style.fontSize = "12px";
            return newMsg;
		},
		
		showMenu(){
			var menu = document.getElementsByClassName("Menu");
 			if (menu[0].style.display === "none") {
 			  menu[0].style.display = "block";
 			} else {
 			  menu[0].style.display = "none";
 			}
		 }
    },
    created() {
        this.socket = io('http://localhost:3000');     

        this.socket.on('sendRoomlist', function(data){
            store.roomList = data.rooms;
            this.getSelect();
            console.log(store.roomList);
		});
		
        this.socket.on('chatToClient', (msg) => {
            this.receiveChatMessage(msg);
        });
    }

})