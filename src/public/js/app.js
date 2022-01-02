const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById( "room");
let roomName;

function addMessage(msg) {
    const ul = room.querySelector('ul');
    const li = document.createElement('li')
    li.innerText = msg;
    ul.appendChild(li);
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector('h3');
    h3.innerText = `Room ${roomName}`;
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector('input');
    roomName = input.value;
    socket.emit("enter_room",roomName, showRoom); //room이라는 이벤트를 보내는 것. 3rd args callback funciton
    input.value="";
}

form.addEventListener('submit', handleRoomSubmit);


socket.on("welcome", () => {
    addMessage("Someones joined!");
})