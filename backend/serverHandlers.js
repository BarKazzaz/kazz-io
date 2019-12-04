const ERRORS = {
    INVALID_ROOM: {msg:"Invalid room name"},
    ROOM_NAME_TAKEN: {msg: "Room name already in use"},
    ROOM_IS_FULL: {msg: "Room is full"}
}
const MAX_NUM_PLAYERS = 5;

function isJoinable(rooms, roomName){
    let message;
    if(rooms.hasOwnProperty(roomName)){
        console.log(Object.keys(rooms[roomName].players).length, MAX_NUM_PLAYERS);
        if (Object.keys(rooms[roomName].players).length < MAX_NUM_PLAYERS)
            message = {title : "joinable", body : roomName};
        else 
            message = {title : "ERR", body : ERRORS.ROOM_IS_FULL};
    }else message = {title : "ERR", body : ERRORS.INVALID_ROOM};
    return message;
}



exports.isJoinable = isJoinable;
exports.ERRORS = ERRORS;