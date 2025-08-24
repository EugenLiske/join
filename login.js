const BASE_URL = "https://join-test-c19be-default-rtdb.firebaseio.com";

// ✅ NEU: eigener Init-Block fürs Login
(function initLoginPwdIcon() {
  handleLoginPwdInput("password_input", "login_password_icon");
})();

// beim Laden: Autofill berücksichtigen
(function initLoginBtn() {
  checkLoginEnable();
})();

function checkLoginEnable() {
  let emailVal = document.getElementById("email_input").value.trim();
  let passVal = document.getElementById("password_input").value; // kein trim bei Passwörtern
  let btn = document.getElementById("login_button");

  // Button nur aktiv, wenn E-Mail syntaktisch ok UND Passwort nicht leer
  let emailOk  = (emailVal !== "" && isEmailValid(emailVal));
  let canLogin = (emailOk && passVal !== "");
  btn.disabled = !canLogin;

  // Fehler sanft zurücksetzen, wenn der/die Nutzer:in weitertippt
  let loginErr = document.getElementById("login_error");
  document.getElementById("email_input").classList.remove("error");
  document.getElementById("password_input").classList.remove("error");
  if (loginErr) {
    loginErr.textContent = "";
    loginErr.style.display = "none";
  }

  return canLogin;
}

async function getAllUsers(path) {
  let fireBaseResponse = await fetch(BASE_URL + path + ".json");
  let fireBaseResponseAsJson = await fireBaseResponse.json();
  return fireBaseResponseAsJson; // gibt Objekt oder null zurück
}

async function loginUser(event) {
  event.preventDefault();

  // Elemente & Werte
  let emailField = document.getElementById("email_input");
  let passField = document.getElementById("password_input");
  let loginErr = document.getElementById("login_error");

  let emailVal = emailField.value.trim().toLowerCase(); // Vergleich immer lowercased
  let passVal = passField.value; // Passwörter nicht trimmen/lowercasen

  // Button-Schutz: nur arbeiten, wenn beide Felder gefüllt
  if (emailVal === "" || passVal === "") {
    return false;
  }

  // vorherige Fehlzustände zurücksetzen
  emailField.classList.remove("error");
  passField.classList.remove("error");
  loginErr.textContent = "";
  loginErr.style.display = "none";

  // Alle User holen
  let userResponse = await getAllUsers("/users");

  // Standard: nicht gefunden
  let matchFound = false;

  if (userResponse) {
    let keys = Object.keys(userResponse);

    for (let i = 0; i < keys.length; i++) {
      let k = keys[i];

      // defensiv lesen
      let dbEmail = "";
      let dbPass = "";

      if (userResponse[k] && userResponse[k].email) {
        dbEmail = String(userResponse[k].email).toLowerCase().trim();
      }
      if (userResponse[k] && userResponse[k].password) {
        dbPass = String(userResponse[k].password);
      }

      // Vergleich: E-Mail (normalisiert) + Passwort (genau)
      if (dbEmail !== "" && dbEmail === emailVal && dbPass === passVal) {
        matchFound = true;
        break;
      }
    }
  }

  if (!matchFound) {
    // Fehler anzeigen (einfach und klar)
    emailField.classList.add("error");
    passField.classList.add("error");
    loginErr.textContent = "Check your email and password. Please try again.";
    loginErr.style.display = "block";
    return false;
  }

    // (7) Overlay wie bisher
  let overlay = document.getElementById("signup_overlay");
  let msg = document.getElementById("overlay_message");

  overlay.classList.add("active");
  msg.classList.add("enter");

  setTimeout(function () {
    overlay.classList.add("leaving");
    setTimeout(function () {
      window.location.href = "summary.html";
    }, 300);
  }, 2700);
}

  // Erfolg – hier kannst du später redirecten
  // alert("Login successful!");
  // window.location.href = "summary.html";
  // return true;


// ✅ NEU: Login-spezifische Version
function handleLoginPwdInput(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);

  if (!input || !icon) return;

  if (input.value.length === 0) {
    input.type = "password";
    icon.src = "./assets/img/icons/form/lock.svg";
    icon.style.pointerEvents = "none";
    return;
  }

  icon.style.pointerEvents = "auto";

  if (input.type === "text") {
    icon.src = "./assets/img/icons/form/visibility.svg";
  } else {
    icon.src = "./assets/img/icons/form/visibility_off.svg";
  }
}

// ✅ NEU: Login-spezifische Version
function toggleLoginVisibility(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);

  if (!input || !icon) return false;

  if (input.value.length === 0) {
    input.type = "password";
    icon.src = "./assets/img/icons/form/lock.svg";
    icon.style.pointerEvents = "none";
    return false;
  }

  if (input.type === "password") {
    input.type = "text";
    icon.src = "./assets/img/icons/form/visibility.svg";
  } else {
    input.type = "password";
    icon.src = "./assets/img/icons/form/visibility_off.svg";
  }

  return false;
}

function isEmailValid(email) {
  let regularExpression = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  return regularExpression.test(email);
}
