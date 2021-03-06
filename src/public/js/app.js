const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");
const call = document.getElementById("call");

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;

async function getCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === "videoinput")
        const currentCamera = myStream.getVideoTracks()[0];
        const option = document.createElement("option");
        option.value = "TEST"
        option.innerText = "TEST";
        camerasSelect.appendChild(option);
        cameras.forEach(camera => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if (currentCamera.label === camera.label) {
                option.selected = true;
            }
            camerasSelect.appendChild(option);
        })
    } catch(e) {
        console.log(e);
    }
}

async function getMedia(deviceId) {
    const initialConstrains = {
        audio : true,
        video: {facingMode: "user"},
    }
    const cameraConstrains = {
        audio: true,
        video: {deviceId : {exact : deviceId} }
    }
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId? cameraConstrains : initialConstrains
        );
        myFace.srcObject = myStream;
        await getCameras();
    } catch (e) {
        console.log(e);
    }

}
// getMedia()

function handleMuteClick() {
    console.log(myStream.getAudioTracks());
    myStream
        .getAudioTracks()
        .forEach((track) => (track.enabled= !track.enabled));
    if(!muted) {
        muteBtn.innerText="Unmute"
        muted = true
    } else {
        muteBtn.innerText="Mute"
        muted = false
    }
}
function handleCameraClick() {
    myStream
        .getVideoTracks()
        .forEach((track) => (track.enabled= !track.enabled));
    if(cameraOff) {
        cameraBtn.innerText="Turn Camera Off"
        cameraOff = false
    } else {
        cameraBtn.innerText="Turn Camera On"
        cameraOff = true
    }
}
async function handleCameraChange() {
    await getMedia(camerasSelect.value);
}
muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);


// Welcome Form(join a room)

const welcome = document.getElementById("welcome");
const welcomeForm = document.querySelector("form");
const roomTitle = document.getElementById("roomTitle");

async function startMedia() {
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}

function handleWelcomeSubmit (event) {
    event.preventDefault()
    const input = welcomeForm.querySelector("input");
    socket.emit("join_room", input.value, startMedia);
    roomName = input.value;
    roomTitle.innerText = roomName;
    input.value="";
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

socket.on("welcome", async () => {
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    console.log("sent the offer");
    socket.emit("offer", offer, roomName);
})

socket.on("offer", offer => {
    myPeerConnection.setLocalDescription(offer);
});

// RTC Code
function makeConnection() {
    myPeerConnection = new RTCPeerConnection();
    myStream.getTracks().forEach(track => {
        myPeerConnection.addTrack(track, myStream)
    });
}