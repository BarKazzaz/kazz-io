const Player = require('./Player')
function Room(room_name){
    this.room_name = room_name;
    this.players = [];

    this.addPlayer = (playerId)=>{
        this.players.push(new Player(playerId));
    }

    this.removePlayer = (id)=>{
        this.players.forEach((elm, i)=> {
            if(elm.id === id)
                this.players.splice(i, 1);
        });
    }
}
module.exports = Room;