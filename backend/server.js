const express = require("express");
//const server = require("http").Server(express);
//const socketIo = require("socket.io")(server);
const cors = require("cors");
require("dotenv").config();
const Room = require("./room");
const handlers = require('./serverHandlers');
const path = require("path");
// const mongoose = require("mongoose");

const MAX_NUM_PLAYERS = 5;
const port = process.env.PORT || 5000;
const app = express();
const server = require("http").createServer(app);
const socketIo = require("socket.io")(server);
//////////////////////////////////////////////////////
let rooms = {"bar": new Room("bar")}

const ERRORS = handlers.ERRORS;

socketIo.on("connection", socket => {
    
    socket.on("isJoinable", (roomName) => {
        let message = handlers.isJoinable(rooms, roomName);
        socket.emit(message.title, message.body);
    });

    socket.on("join", roomName => {
        if(rooms.hasOwnProperty(roomName)){
            let numOfPlayersInRoom = Object.keys(rooms[roomName].players).length;
            if (numOfPlayersInRoom >= MAX_NUM_PLAYERS){
                socket.emit("ERR", ERRORS.ROOM_IS_FULL);
                return;
            }
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
    
    socket.on("listRooms",() => {console.log(rooms); socket.emit("roomsList", rooms)});

    socket.on("move", ({room, playerId, direction}) => {
        let position = rooms[room].players[playerId].position;
        switch (direction){
            case "U":
                position.y -= 20;
                break;
            case "D":
                position.y += 20;
                break;
            case "L":
                position.x -= 20;
                break;
            case "R":
                position.x += 20;
                break;
            default:
                console.log(direction);
        }
        socket.emit("position", playerId, position);
        socket.to(room).emit("position", playerId, position);
    })
});

if (process.env.NODE_ENV === "production"){//if heroku is running
    console.log("for heroku!");
    app.use(express.static(path.resolve(__dirname,"../kazz-io/build")));
    app.get("*", (req, res) => {
        console.log("got request");
        res.sendFile(path.resolve(__dirname, "..", "kazz-io", "build", "index.html"));
    });    
}
server.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});