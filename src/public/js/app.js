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

function handleMessageSubmit (event) {
    event.preventDefault();
    const input = room.querySelector('#msg input');
    const value = input.value;
    socket.emit('new_message', value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}
function handleNickNameSubmit (event) {
    event.preventDefault();
    const input = room.querySelector('#name input');
    const value = input.value;
    socket.emit('nickname', value);
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector('h3');
    h3.innerText = `Room ${roomName}`;

    const msgForm = room.querySelector('#msg');
    const nameForm = room.querySelector('#name');
    msgForm.addEventListener('submit', handleMessageSubmit);
    nameForm.addEventListener('submit', handleNickNameSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector('input');
    roomName = input.value;
    socket.emit("enter_room",roomName, showRoom); //room이라는 이벤트를 보내는 것. 3rd args callback funciton
    input.value="";
}

form.addEventListener('submit', handleRoomSubmit);


socket.on("welcome", (user) => {
    addMessage(`${user} arrive!`);
})
socket.on("bye", (left) => {
    addMessage(`${left} left!`);
})

// socket.on("new_message", (msg) => {addMessage(msg)});
socket.on("new_message", addMessage);