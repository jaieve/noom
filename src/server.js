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
const sockets = [];


// 여기에서의 socket은 연결된 브라우저를 뜻함
wss.on("connection", (socket) => {
    // connection이 생기면 socket을 받게 된다.
    sockets.push(socket);
    socket['nickname'] = "Anon";
    socket.on('open', () => {console.log("Connected to Server ❌");})
    socket.on("close", () => {
        console.log("Disconnected from Server ❌");
    })
    socket.on("message", (msg) => {
        const messageObject = JSON.parse(msg);
        switch (messageObject.type){
            case "new_message":
                sockets.forEach((aSocket) =>
                    aSocket.send(`${socket.nickname}: ${messageObject.payload}`)
                );
                break
            case "nickname":
                socket.nickname = messageObject.payload;
                break
        }
    })
    // socket.send() : backend에서 front-end로 보내는 것.
})

server.listen(3000, handleListen);
