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



function displayToastMessage(overlayId, messageId, page) {
  const overlayRef = document.getElementById(overlayId);
  const messageRef = document.getElementById(messageId);
  overlayRef.classList.add("active");
  messageRef.classList.add("enter");
  setTimeout(function () {
    overlayRef.classList.add("leaving");
    setTimeout(function () {
    window.location.href = page;
    }, 300);
  }, 2700);
}