const Player = require('./Player')
function Room(room_name){
    this.room_name = room_name;
    this.players = {};

    this.addPlayer = (playerId)=>{
        if(this.players.hasOwnProperty(playerId))
            return "Player ID taken";
        this.players[playerId] = new Player(playerId);
    }

    this.removePlayer = (id)=>{
        delete this.players[id];
    }
}
module.exports = Room;