const Player = require('./Player')
function Room(room_name){
    this.room_name = room_name;
    this.players = [];

    this.addPlayer = (playerId)=>{
        this.players.push(new Player(playerId));
    }
}
module.exports = Room;