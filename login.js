// Referenzen der DOM-Elemente und weitere Variablen

const emailInput          = document.getElementById("email_input");
const passwordInput       = document.getElementById("password_input");
const loginButton         = document.getElementById("login_button");
const loginErrorContainer = document.getElementById("login_error");
const loginPwdIcon        = document.getElementById("login_password_icon");
const signupOverlay       = document.getElementById("signup_overlay");
const overlayMessage      = document.getElementById("overlay_message");
const passwordInputField  = document.getElementById("password_input");
const passwordIcon        = document.getElementById("login_password_icon");

const BASE_URL = "https://join-test-c19be-default-rtdb.firebaseio.com";

// Funktion für eventuelles Autofill. Passwort-Icons und der Button-Zustand werden richtig gesetzt.

function initLoginAutoFill() {
  handleLoginPasswordInput("password_input", "login_password_icon");
  checkLoginEnable();
}
initLoginAutoFill();

// Firebase-Datenbank: Funktion für GET für die User-Daten

async function getAllUsers(path) {
  try {
    let fireBaseResponse = await fetch(BASE_URL + path + ".json");
    if (!fireBaseResponse.ok) {
      throw new Error(`GET ${path} failed: ${fireBaseResponse.status} ${fireBaseResponse.statusText}`);
    }
    let fireBaseResponseAsJson = await fireBaseResponse.json();
    return fireBaseResponseAsJson;
  } catch (error) {
    console.error("getAllUsers error:", error);
    throw error;
  }
}

// Login-Funktion (Login-Button)

async function loginUser(event) {
  event.preventDefault();
  let emailValue    = emailInput.value.trim().toLowerCase();
  let passwordValue = passwordInput.value;
  try {
    let userResponse = await getAllUsers("/users");
    let matchedUser = findMatchingUser(userResponse, emailValue, passwordValue);
    if (!matchedUser) return showLoginErrorAndStop();
    storeUserInitials(matchedUser);
    createSuccessOverlayLogin();
    login = true;
    return true;
  } catch (error) {
    console.error("loginUser failed:", error);
    showGenericLoginError();
    return false;
  }
}

// Hilfsfunktionen für die loginUser-Funktion

function findMatchingUser(userResponse, emailValue, passwordValue) {
  let users = Object.values(userResponse);
  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    if (checkSingleUserMatch(user, emailValue, passwordValue)) {
      return user;
    }
  }
  return null;
}

function checkSingleUserMatch(user, emailValue, passwordValue) {
  let dbEmail = "";
  let dbPassword = "";
  if (user && user.email) {
    dbEmail = String(user.email).toLowerCase().trim();
  }
  if (user && user.password) {
    dbPassword = String(user.password);
  }
  return dbEmail !== "" && dbEmail === emailValue && dbPassword === passwordValue;
}

function storeUserInitials(user) {
  if (user && user.initials) {
    let initials = String(user.initials);
    if (initials !== "") {
      sessionStorage.setItem("initials", initials);
    }
  }
}

function showLoginErrorAndStop() {
  emailInput.classList.add("error");
  passwordInput.classList.add("error");
  loginErrorContainer.textContent = "Check your email and password. Please try again.";
  loginErrorContainer.style.display = "block";
  return false;
}

function showGenericLoginError() {
  loginErrorContainer.textContent = "We couldn't sign you in right now. Please try again in a moment.";
  loginErrorContainer.style.display = "block";
}

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

// Validierungsfunktion - aktiviert den Login-Button bei validen Eingaben

function checkLoginEnable() {
  let emailValue = emailInput.value.trim();
  let passwordValue = passwordInput.value;
  let emailOk = emailValue !== "" && isEmailValid(emailValue);
  let canLogin = emailOk && passwordValue !== "";
  loginButton.disabled = !canLogin;
  resetExistingLoginError();
}

// Hilfsfunktion für die checkLoginEnable-Funktion

function isEmailValid(email) {
  let regularExpression = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  return regularExpression.test(email);
}

// Bereinigung der Fehleranzeige bei erneuter Eingabe (oninput).
// Für denn Fall dass eine nicht valide Email-Passwort-Kombination bei loginUser eingegeben wurde

function resetExistingLoginError() {
  emailInput.classList.remove("error");
  passwordInput.classList.remove("error");
  if (loginErrorContainer) {
    loginErrorContainer.textContent = "";
    loginErrorContainer.style.display = "none";
  }
}

// Sichtbarkeits-Handling der Passwort-Icons bei Eingabe des Passwortes sowie beim Anklicken des Icons.

function handleLoginPasswordInput() {
  if (passwordInputField.value.length === 0) {
    passwordInputField.type = "password";
    passwordIcon.src = "./assets/img/icons/form/lock.svg";
    passwordIcon.style.pointerEvents = "none";
    return;
  }
  passwordIcon.style.pointerEvents = "auto";
  if (passwordInputField.type === "text") {
    passwordIcon.src = "./assets/img/icons/form/visibility.svg";
  } else {
    passwordIcon.src = "./assets/img/icons/form/visibility_off.svg";
  }
}

function toggleLoginVisibility() {
  if (passwordInputField.value.length === 0) {
    passwordInputField.type = "password";
    passwordIcon.src = "./assets/img/icons/form/lock.svg";
    passwordIcon.style.pointerEvents = "none";
    return;
  }
  if (passwordInputField.type === "password") {
    passwordInputField.type = "text";
    passwordIcon.src = "./assets/img/icons/form/visibility.svg";
  } else {
    passwordInputField.type = "password";
    passwordIcon.src = "./assets/img/icons/form/visibility_off.svg";
  }
}
