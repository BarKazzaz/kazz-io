const express = require("express");
const app = express();
const server = require("http").Server(app);
const socketIo = require("socket.io")(server);
const path = require("path");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

const Room = require("./room");
const handlers = require('./serverHandlers');
const MAX_NUM_PLAYERS = 5;
const port = process.env.PORT || 5000;
const FPS = 17;// 1000 / 60 = 16.66667
//////////////////////////////////////////////////////
let rooms = {"bar": new Room("bar")};
let intervals = {};
const ERRORS = handlers.ERRORS;

function sendRoomState(roomName){
    socketIo.sockets.in(roomName).emit("roomState", rooms[roomName]);
}

socketIo.on("connection", socket => {
    
    socket.on("isJoinable", (roomName) => {
        let message = handlers.isJoinable(rooms, roomName);
        socket.emit(message.title, message.body);
    });

    socket.on("join", roomName => {
        if(rooms.hasOwnProperty(roomName)){
            let numOfPlayersInRoom = Object.keys(rooms[roomName].players).length;
            if (numOfPlayersInRoom >= MAX_NUM_PLAYERS)
                return socket.emit("ERR", ERRORS.ROOM_IS_FULL);
            else if(numOfPlayersInRoom < 1)
                intervals[roomName] = setInterval(()=>sendRoomState(roomName), FPS);

            let id = '_' + Math.random().toString(36).substr(2, 9);
            rooms[roomName].addPlayer(id);
            socket.join(roomName, (err) => {
                if(err) { 
                    socket.emit("ERR", {msg: err}); 
                }else { 
                    let currentPlayers = rooms[roomName].players;
                    socket.emit("didJoin", id, currentPlayers);
                    socket.to(roomName).emit("playerJoined",id);
                    numOfPlayersInRoom += 1;
                    if( numOfPlayersInRoom == MAX_NUM_PLAYERS){
                        console.log("room is full, starting game!");
                        socketIo.sockets.in(roomName).emit("startGame");
                    }
                }
            });
        }else
            socket.emit("ERR", ERRORS.INVALID_ROOM);
    });

    socket.on("removePlayer", (roomName, playerId)=>{
        console.log("this dude is leaving:", roomName, playerId);
        if(rooms.hasOwnProperty(roomName)){
            rooms[roomName].removePlayer(playerId);
            socket.to(roomName).emit("playerRemoved",playerId);
            if(Object.keys(rooms[roomName].players).length < 1)
                clearInterval(intervals[roomName]);
        }
    });

    socket.on("create", roomName => {
        if(rooms.hasOwnProperty(roomName)){
            socket.emit("ERR", ERRORS.ROOM_NAME_TAKEN);
        }else {
            rooms[roomName] = new Room(roomName);
            console.log(roomName, "Created!", rooms);
            socket.emit("created", roomName);
        }
    });
    
    socket.on("listRooms",() => { socket.emit("roomsList", rooms) });

    socket.on("move", ({room, playerId, direction}) => {
        if(!rooms[room] || !rooms[room].players || !rooms[room].players[playerId])
            return console.log("ERR unable to get player");
        let position = rooms[room].players[playerId].position;
        rooms[room].players[playerId].bgPositionX = (rooms[room].players[playerId].bgPositionX + 32) % 64; //animating the spritesheet 32px at a time
        switch (direction){
            case "U":
                position.y -= 20;
                rooms[room].players[playerId].bgPositionY = 73;
                break;
            case "D":
                position.y += 20;
                rooms[room].players[playerId].bgPositionY = 0;
                break;
            case "L":
                position.x -= 20;
                rooms[room].players[playerId].bgPositionY = 37;
                break;
            case "R":
                position.x += 20;
                rooms[room].players[playerId].bgPositionY = 108;
                break;
            default:
                console.log(direction);
        }
    })
});

if (process.env.NODE_ENV === "production"){//if heroku is running
    console.log("for heroku!");
    app.use(express.static(path.resolve(__dirname, "..", "kazz-io", "build")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "..", "kazz-io", "build", "index.html"));
    });    
}
server.listen(port, (err) => {
    if (err) console.error(err);
    console.log(`server is running on port: ${port}`);
});