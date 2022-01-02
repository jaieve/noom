const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector('input');
    socket.emit("testroom", {payload : input.value}, () => {
        console.log("server is done!"); // front 단에서 실행되는 console.log이기 때문에 브라우저의 개발자도구 console에서 print됨.
    }); //room이라는 이벤트를 보내는 것. 3rd args callback funciton
    // backend로 object를 보낼 수 있다.
    input.value="";
}

form.addEventListener('submit', handleRoomSubmit);