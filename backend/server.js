const express = require("express");
const HTTP = require("http").Server(express);
const socketIo = require("socket.io")(HTTP);
const cors = require("cors");
// const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

let position = {
    x: 200,
    y: 200
};

socketIo.on("connection", socket =>{
    socket.emit("position", position);
});

app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});