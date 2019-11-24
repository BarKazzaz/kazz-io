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

socketIo.on("connection", socket => {
    socket.emit("position", position);
});

server.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});