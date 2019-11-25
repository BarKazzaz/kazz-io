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
            socket.join(roomName);
            socket.emit("connected");
        }
        else
            socket.emit("ERR", ERRORS.INVALID_ROOM);
    });
    socket.on("create", roomName => {
        if(rooms.includes(roomName)){
            socket.emit("ERR", ERRORS.ROOM_NAME_TAKEN);
        }else 
            socket.emit("connected");
    })
});

server.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});