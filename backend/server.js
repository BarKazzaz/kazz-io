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
    INVALID_ROOM: {msg:"Invalid room name"}
}

socketIo.on("connection", socket => {
    socket.on("create", roomName => {
        if(rooms.includes(roomName)){
            socket.join(roomName);
            socket.emit("connected");
        }
        else
            socket.emit("ERR", ERRORS.INVALID_ROOM);
    });
});

server.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});