document.addEventListener("DOMContentLoaded", () => {
// Registrierung
const registerForm = document.getElementById("registerForm");
if (registerForm) {
registerForm.addEventListener("submit", (e) => {
e.preventDefault();
const nickname = document.getElementById("nickname").value.trim();
const password = document.getElementById("password").value;
const age = parseInt(document.getElementById("age").value);
const errorMessage = document.getElementById("errorMessage");

// Prüfen, ob der Name bereits existiert
const users = JSON.parse(localStorage.getItem("users")) || [];
if (users.some(user => user.nickname === nickname)) {
errorMessage.textContent = "Dieser Nickname ist bereits vergeben!";
return;
}

// Passwortlänge prüfen
if (password.length < 6) {
errorMessage.textContent = "Das Passwort muss mindestens 6 Zeichen lang sein!";
return;
}

// Altersprüfung
if (age < 18) {
errorMessage.textContent = "Du musst mindestens 18 Jahre alt sein!";
return;
}

// Neuen Benutzer speichern
users.push({ nickname, password });
localStorage.setItem("users", JSON.stringify(users));

sessionStorage.setItem("loggedInUser", nickname);
window.location.href = "videochat.html"; // Weiterleitung zur Videochat-Seite
});
}

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
loginForm.addEventListener("submit", (e) => {
e.preventDefault();
const nickname = document.getElementById("nickname").value.trim();
const password = document.getElementById("password").value;
const errorMessage = document.getElementById("errorMessage");

const users = JSON.parse(localStorage.getItem("users")) || [];
const user = users.find(user => user.nickname === nickname && user.password === password);

if (user) {
sessionStorage.setItem("loggedInUser", nickname);
window.location.href = "videochat.html"; // Weiterleitung zur Videochat-Seite
} else {
errorMessage.textContent = "Falscher Nickname oder falsches Passwort!";
}
});
}
});