const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function backEndDone(timestamp) {
    console.log(timestamp);
    console.log("server process is Done!");
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector('input');
    socket.emit("testroom", {payload : input.value}, backEndDone); //room이라는 이벤트를 보내는 것. 3rd args callback funciton
    // backend로 object를 보낼 수 있다.
    input.value="";
}

form.addEventListener('submit', handleRoomSubmit);