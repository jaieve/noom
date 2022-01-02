const messageList = document.querySelector(("ul"));
const messageForm = document.querySelector(("form"));
const socket = new WebSocket(`ws://${window.location.host}`)  // mobile은 localhost를 모름
// socket = 서버로의 연결. 브라우저(frontend)가 backend과 connection을 열어주고 있는 코드

// socket evnets : open, close, messgae,
socket.addEventListener('open', () => {
    console.log("Connected to Server ✔");
})
socket.addEventListener('message', async event => {console.log("New message: ", await event.data.text());})
socket.addEventListener('close', () => {
    console.log("Disconnected from Server ❌");
});

function handleSubmit(e) {
    e.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(input.value);
    input.value="";
}

messageForm.addEventListener("submit", handleSubmit);