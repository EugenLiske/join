// Referenzen der DOM-Elemente
const nameInput = document.getElementById("name_input");
const emailInput = document.getElementById("email_input");
const passwordInput = document.getElementById("password_input");
const confirmationPasswordInput = document.getElementById("confirm_input");
const checkbox = document.getElementById("privacy_checkbox");
const signupButton = document.getElementById("signup_button");
const confirmationError = document.getElementById("confirm_error");
const signupOverlay = document.getElementById("signup_overlay"); // optional, für Konsistenz
const overlayMessage = document.getElementById("overlay_message");

const DUPLICATE_MSG =
  "This user exists already. Please use a different email address.";
const BASE_URL = "https://join-test-c19be-default-rtdb.firebaseio.com";

// Funktion für eventuelles Autofill. PW-Icons und der Button-Zustand werden richtig gesetzt

function initAutoFill() {
  validateForm();
  handlePasswordInput("password_input", "password_icon");
  handlePasswordInput("confirm_input", "confirm_icon");
}

initAutoFill();

function getInitials(rawName) {
  let cleanName = String(rawName || "").trim();
  let nameParts = cleanName.split(/\s+/);
  let firstInitial = nameParts[0].charAt(0);
  let lastInitial = "";

  if (nameParts.length > 1) {
    let lastName = nameParts[nameParts.length - 1];
    lastInitial = lastName.charAt(0);
  }

  let initials = firstInitial + lastInitial;
  initials = initials.toUpperCase();
  return initials;
}

async function getAllUsers(path) {
  try {
    let fireBaseResponse = await fetch(BASE_URL + path + ".json");
    if (!fireBaseResponse.ok) {
      throw new Error(
        `GET ${path} failed: ${fireBaseResponse.status} ${fireBaseResponse.statusText}`
      );
    }

    let fireBaseResponseAsJson = await fireBaseResponse.json();
    return fireBaseResponseAsJson;
  } catch (error) {
    console.error("getAllUsers error:", error);
    throw error;
  }
}

async function putUserData(path, data) {
  try {
    let fireBaseResponse = await fetch(BASE_URL + path + ".json", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!fireBaseResponse.ok) {
      throw new Error(
        `PUT ${path} failed: ${fireBaseResponse.status} ${fireBaseResponse.statusText}`
      );
    }
  } catch (error) {
    console.error("putUserData error:", error);
    throw error;
  }
}

async function registerUser(event) {
  event.preventDefault();
  if (!validateForm()) {
    return false;
  }

  try {
    let userResponse = await getAllUsers("/users");
    // Prüfung nach vorhandenem User mittels der Emailadresse

    if (checkExistingUsers(userResponse)) {
      return false;
    }

    let nextUserID = calculateNextUserID(userResponse);

    // Input-Werte auslesen
    let nameVal = nameInput.value.trim();
    let emailVal = emailInput.value.trim().toLowerCase();
    let passVal = passwordInput.value;

    // Neues User-Objekt erstellen
    let user = {
      name: nameVal,
      email: emailVal,
      password: passVal,
      initials: getInitials(nameVal),
    };

    // Pfad für den neuen User bauen
    let path = "/users/user_" + nextUserID;

    // User in Firebase speichern
    await putUserData(path, user);

    // Overlay der Toast-Nachricht aktivieren

    signupOverlay.classList.add("active");
    overlayMessage.classList.add("enter");

    setTimeout(function () {
      overlay.classList.add("leaving");
      setTimeout(function () {
        window.location.href = "login.html";
      }, 300);
    }, 27000000);
  } catch (error) {
    console.error("registerUser failed:", error);
    return false;
  }
}

function isEmailValid(email) {
  let regularExpression = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  return regularExpression.test(email);
}

function validateForm() {
  let nameVal = nameInput.value.trim();
  let emailVal = emailInput.value.trim();
  let passVal = passwordInput.value; // ⚠️ kein trim bei Passwörtern
  let confVal = confirmationPasswordInput.value;
  let checked = checkbox.checked;

  const MIN_LEN = 8;

  let notEmpty =
    nameVal !== "" && emailVal !== "" && passVal !== "" && confVal !== "";
  let emailOk = isEmailValid(emailVal);
  let passMatch = passVal !== "" && passVal === confVal;
  let passLenOk = passVal.length >= MIN_LEN;

  // Fehlerlogik (Passwort)
  let showMismatch = passVal !== "" && confVal !== "" && passVal !== confVal;
  let showTooShort =
    passVal !== "" && confVal !== "" && passMatch && !passLenOk;

  if (showMismatch) {
    confirmationPasswordInput.classList.add("error");
    confirmationError.textContent =
      "Your passwords don't match. Please try again.";
    confirmationError.style.display = "block";
  } else if (showTooShort) {
    confirmationPasswordInput.classList.add("error");
    confirmationError.textContent =
      "Your password must be at least 8 characters long";
    confirmationError.style.display = "block";
  } else {
    confirmationPasswordInput.classList.remove("error");
    confirmationError.textContent = "";
    confirmationError.style.display = "none";
  }

  let allOk = notEmpty && emailOk && passMatch && passLenOk && checked;
  signupButton.disabled = !allOk;
  return allOk;
}

// Sichtbarkeits-Handling (wie gehabt)
function handlePasswordInput(inputId, iconId) {
  let input = document.getElementById(inputId);
  let icon = document.getElementById(iconId);

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

function togglePwIconVisibility(inputId, iconId) {
  let input = document.getElementById(inputId);
  let icon = document.getElementById(iconId);

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

function clearEmailError() {
  emailInput.classList.remove("error");
  if (confirmationError.textContent === DUPLICATE_MSG) {
    confirmationError.textContent = "";
    confirmationError.style.display = "none";
  }
}

function checkExistingUsers(userResponse) {
  let emailToCheck = emailInput.value.trim().toLowerCase();
  if (userResponse) {
    let userKeys = Object.keys(userResponse);
    for (let i = 0; i < userKeys.length; i++) {
      let singleUserKey = userKeys[i];
      let existingEmail = "";
      if (userResponse[singleUserKey] && userResponse[singleUserKey].email) {
        existingEmail = String(userResponse[singleUserKey].email).toLowerCase().trim();
      }
      if (existingEmail !== "" && existingEmail === emailToCheck) {
        emailInput.classList.add("error");
        confirmationError.style.display = "block";
        confirmationError.textContent = "This user exists already. Please use a different email address.";
        return true; // Sofort: E-Mail existiert bereits
      }
    }
  }
  return false; // Nach kompletter Schleife: kein Duplikat gefunden
}

function calculateNextUserID(userResponse) {
  let nextUserID = 1;
  if (userResponse) {
    let userKeys = Object.keys(userResponse);
    let highestUserID = 0;

    for (let i = 0; i < userKeys.length; i++) {
      let singleUserKey = userKeys[i];

      if (singleUserKey.startsWith("user_")) {
        let userIdString = singleUserKey.substring(5); 
        let userIdNumber = parseInt(userIdString, 10); 

        if (!isNaN(userIdNumber) && userIdNumber > highestUserID) {
          highestUserID = userIdNumber; 
        }
      }
    }

    nextUserID = highestUserID + 1;
    return nextUserID
  }
}

async function createAndUploadUserObject(){
    let nameVal = nameInput.value.trim();
    let emailVal = emailInput.value.trim().toLowerCase();
    let passVal = passwordInput.value;

    let user = {
      name: nameVal,
      email: emailVal,
      password: passVal,
      initials: getInitials(nameVal),
    };

    let path = "/users/user_" + nextUserID;

    await putUserData(path, user);
}
