const socket = io("https://arko119.github.io/meinchat/"); // WebRTC-Server-URL einfügen
let localStream;
let peerConnection;
const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

// Lokales Video abrufen
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
.then(stream => {
document.getElementById("localVideo").srcObject = stream;
localStream = stream;
})
.catch(error => console.error("Fehler beim Abrufen des Videos:", error));

// WebRTC-Verbindung starten
function startCall() {
peerConnection = new RTCPeerConnection(config);
peerConnection.addStream(localStream);

peerConnection.onicecandidate = event => {
if (event.candidate) {
socket.emit("candidate", event.candidate);
}
};

peerConnection.onaddstream = event => {
document.getElementById("remoteVideo").srcObject = event.stream;
};

peerConnection.createOffer()
.then(offer => {
peerConnection.setLocalDescription(offer);
socket.emit("offer", offer);
});
}

// Partner wechseln
document.getElementById("changePartner").addEventListener("click", () => {
peerConnection.close();
startCall();
});

// WebRTC-Nachrichten empfangen
socket.on("offer", data => {
peerConnection = new RTCPeerConnection(config);
peerConnection.addStream(localStream);

peerConnection.onicecandidate = event => {
if (event.candidate) {
socket.emit("candidate", event.candidate);
}
};

peerConnection.onaddstream = event => {
document.getElementById("remoteVideo").srcObject = event.stream;
};

peerConnection.setRemoteDescription(new RTCSessionDescription(data));
peerConnection.createAnswer()
.then(answer => {
peerConnection.setLocalDescription(answer);
socket.emit("answer", answer);
});
});

socket.on("answer", data => {
peerConnection.setRemoteDescription(new RTCSessionDescription(data));
});

socket.on("candidate", data => {
peerConnection.addIceCandidate(new RTCIceCandidate(data));
});