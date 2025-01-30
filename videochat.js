let localStream;
let peerConnection;
const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const startCallButton = document.getElementById("startCall");
const changePartnerButton = document.getElementById("changePartner");
const logoutButton = document.getElementById("logout");
const statusText = document.getElementById("status");

// Prüfen, ob Nutzer eingeloggt ist
const loggedInUser = sessionStorage.getItem("loggedInUser");
if (!loggedInUser) {
window.location.href = "index.html";
}

// Zugriff auf Webcam & Mikrofon
async function startMedia() {
try {
localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
localVideo.srcObject = localStream;
} catch (error) {
console.error("Fehler beim Zugriff auf Mediengeräte:", error);
}
}

// WebRTC Verbindung aufbauen
async function startCall() {
peerConnection = new RTCPeerConnection(config);

localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

peerConnection.ontrack = event => {
remoteVideo.srcObject = event.streams[0];
};

peerConnection.onicecandidate = event => {
if (event.candidate) {
console.log("Senden der ICE-Kandidaten:", event.candidate);
}
};

const offer = await peerConnection.createOffer();
await peerConnection.setLocalDescription(offer);

console.log("Angebot erstellt:", offer);
}

// Partner wechseln (Neustart)
function changePartner() {
if (peerConnection) {
peerConnection.close();
}
statusText.textContent = "Neuen Partner suchen...";
startCall();
}

// Abmeldung
logoutButton.addEventListener("click", () => {
sessionStorage.removeItem("loggedInUser");
window.location.href = "index.html";
});

// Event-Listener hinzufügen
startCallButton.addEventListener("click", startCall);
changePartnerButton.addEventListener("click", changePartner);

// Webcam aktivieren
startMedia();