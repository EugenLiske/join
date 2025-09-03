// Funktion fügt CSS-Eigenschaften hinzu, die das Einblenden der Toast-Nachricht simulieren.
// Variablendeklaration zu Beginn, um die Funktion schlanker zu halten.

const signupOverlay       = document.getElementById("signup_overlay");
const overlayMessage      = document.getElementById("overlay_message");

function createSuccessOverlayLogin() {
  signupOverlay.classList.add("active");
  overlayMessage.classList.add("enter");
  setTimeout(function () {
    signupOverlay.classList.add("leaving");
    setTimeout(function () {
      window.location.href = "summary.html";
    }, 300);
  }, 2700);
}