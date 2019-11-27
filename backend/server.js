const express = require("express");
const server = require("http").Server(express);
const socketIo = require("socket.io")(server);
const cors = require("cors");
// const mongoose = require("mongoose");

require("dotenv").config();

const port = process.env.PORT || 5000;

let position = {
    x: 200,
    y: 200
};

let rooms = ['room1'];
const ERRORS = {
    INVALID_ROOM: {msg:"Invalid room name"},
    ROOM_NAME_TAKEN: {msg: "Room name already in use"}
}

socketIo.on("connection", socket => {
    socket.on("join", roomName => {
        if(rooms.includes(roomName)){
            socket.join(roomName, (err) => {
                if(err) socket.emit("ERR", {msg: err});
                else{ socket.emit("joinable", roomName); socket.emit("connected"); }
            });
        }else
            socket.emit("ERR", ERRORS.INVALID_ROOM);
    });
    socket.on("create", roomName => {
        if(rooms.includes(roomName)){
            socket.emit("ERR", ERRORS.ROOM_NAME_TAKEN);
        }else {
            rooms.push(roomName);
            console.log(roomName, "Created!", rooms);
            socket.emit("created", roomName);
        }
    });
    socket.on("listRooms",() => socket.emit("roomsList", rooms));

    socket.on("move", direction => {
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
        socket.emit("position", position);
    })
});

server.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});