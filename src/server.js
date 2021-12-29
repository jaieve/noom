import express from "express";
import {WebSocket} from "ws";
import http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);

const handleListen = () => console.log(`Listening on ws://localhost:3000`);
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

    // 여기에서의 socket은 연결된 브라우저를 뜻함
wss.on("connection", (socket) => {
    socket.on('close', () => {
        console.log("Connected to Server ❌");
    })
    socket.send("Hello!");
    console.log("Connected to Browser ✔");
})

server.listen(3000, handleListen);