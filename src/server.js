import express from "express";
// import {WebSocket} from "ws";
import SocketIO from "socket.io";
import http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const server = http.createServer(app);
const io = SocketIO(server);

io.on("connection", socket => {
    socket.on("testroom", (msg, done) => {
        console.log(msg); // msg is javascript object!
        setTimeout(() => {
            done();
        }, 1000)
    })
});

const handleListen = () => console.log(`Listening on ws://localhost:3000`);
server.listen(3000, handleListen);
