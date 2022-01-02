const messageList = document.querySelector(("ul"));
const nickForm = document.querySelector(("#nickname"));
const messageForm = document.querySelector(("#message"));
const socket = new WebSocket(`ws://${window.location.host}`)  // mobile은 localhost를 모름
// socket = 서버로의 연결. 브라우저(frontend)가 backend과 connection을 열어주고 있는 코드

function makeMessage(type, payload) {
    const msg = {type, payload}
    return JSON.stringify(msg);
}

// socket evnets : open, close, messgae,
socket.addEventListener('open', () => {
    console.log("Connected to Server ✔");
})
socket.addEventListener('message', async event => {
    const li = document.createElement('li');
    // console.dir(await event.data);
    li.innerText = await event.data;
    messageList.append(li);
})
socket.addEventListener('close', () => {
    console.log("Disconnected from Server ❌");
});

async function handleSubmit( event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    const li = document.createElement('li');
    // console.dir(await event.data);
    li.innerText = `You: ${input.value}`;
    messageList.append(li);
    input.value="";
}
function handleNickSubmit(e) {
    e.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    input.value="";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);