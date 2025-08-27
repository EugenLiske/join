// Referenzen der DOM-Elemente und weitere Variablen
const nameInput = document.getElementById("name_input");
const emailInput = document.getElementById("email_input");
const passwordInput = document.getElementById("password_input");
const confirmationPasswordInput = document.getElementById("confirm_input");
const checkbox = document.getElementById("privacy_checkbox");
const signupButton = document.getElementById("signup_button");
const confirmationError = document.getElementById("confirm_error");
const signupOverlay = document.getElementById("signup_overlay"); // optional, für Konsistenz
const overlayMessage = document.getElementById("overlay_message");

const USER_EXISTS_MSG =
  "This user exists already. Please use a different email address.";
const PASSWORD_MIN_LENGHT = 8;
const BASE_URL = "https://join-test-c19be-default-rtdb.firebaseio.com";

// Funktion für eventuelles Autofill. Passwort-Icons und der Button-Zustand werden richtig gesetzt.

function initAutoFill() {
  validateForm();
  handlePasswordInput("password_input", "password_icon");
  handlePasswordInput("confirm_input", "confirm_icon");
}

initAutoFill();

// Firebase-Datenbank: Funktionen für GET und PUT für die User-Daten

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

// Registrierfunktion (Sign Up Button)

async function registerUser(event) {
  event.preventDefault();
  if (!validateForm()) {
    return false;
  }
  try {
    let userResponse = await getAllUsers("/users");
    if (checkExistingUsers(userResponse)) {
      return false;
    }
    let nextUserID = calculateNextUserID(userResponse);
    await createAndUploadUserObject(nextUserID);
    createSuccessOverlay();
  } catch (error) {
    console.error("registerUser failed:", error);
    return false;
  }
}

// Hilfsfunktionen für die registerUser-Funktion

function checkExistingUsers(userResponse) {
  let emailToCheck = emailInput.value.trim().toLowerCase();
  if (userResponse && checkEveryUserEmail(userResponse, emailToCheck)) {
    emailInput.classList.add("error");
    confirmationError.style.display = "block";
    confirmationError.textContent = USER_EXISTS_MSG;
    return true;
  }
  return false;
}

function checkEveryUserEmail(userResponse, emailToCheck) {
  let userKeys = Object.keys(userResponse);
  for (let i = 0; i < userKeys.length; i++) {
    let singleUserKey = userKeys[i];
    let existingEmail = "";
    if (userResponse[singleUserKey] && userResponse[singleUserKey].email) {
      existingEmail = String(userResponse[singleUserKey].email)
        .toLowerCase()
        .trim();
    }
    if (existingEmail !== "" && existingEmail === emailToCheck) {
      return true; // sofort Abbruch → Mail gefunden
    }
  }
  return false; // nichts gefunden nachdem man alle Mailadressen durchsucht hat
}

function calculateNextUserID(userResponse) {
  if (!userResponse) return 1;
  let highestUserID = 0;
  let userKeys = Object.keys(userResponse);
  for (let index = 0; index < userKeys.length; index++) {
    let singleUserKey = userKeys[index];
    if (singleUserKey.startsWith("user_")) {
      let userIdString = singleUserKey.slice(5);
      let userIdNumber = parseInt(userIdString, 10);
      if (!isNaN(userIdNumber) && userIdNumber > highestUserID)
        highestUserID = userIdNumber; // Nur ein Statement, daher keine geschweiften Klammern
    }
  }
  return highestUserID + 1;
}

async function createAndUploadUserObject(nextUserID) {
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

function createSuccessOverlay() {
  signupOverlay.classList.add("active");
  overlayMessage.classList.add("enter");
  setTimeout(function () {
    signupOverlay.classList.add("leaving");
    setTimeout(function () {
      window.location.href = "login.html";
    }, 300);
  }, 2700);
}

// Validierungsfunktion - aktiviert den Sign Up Button bei validen Eingaben

function validateForm() {
  const formInput = readFormInput(); // aktuelle Feldwerte
  const evaluatedFormInput = evaluateFormInput(formInput); // alle Prüfergebnisse
  renderPasswordErrors(evaluatedFormInput); // Fehlermeldung anzeigen/verbergen
  setSignupButtonState(evaluatedFormInput.allValid); // Button aktiv/deaktiv
  return evaluatedFormInput.allValid; // für registerUser() wichtig
}

// ---- helpers ----

function readFormInput() {
  return {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value, // ⚠️ kein trim
    confirmPassword: confirmationPasswordInput.value,
    privacyChecked: checkbox.checked,
  };
}

function evaluateFormInput(formInput) {
  const allFieldsFilled =
    formInput.name !== "" &&
    formInput.email !== "" &&
    formInput.password !== "" &&
    formInput.confirmPassword !== "";
  const emailFormatValid = isEmailValid(formInput.email);
  const passwordsMatch =
    formInput.password !== "" &&
    formInput.password === formInput.confirmPassword;
  const passwordLongEnough = formInput.password.length >= PASSWORD_MIN_LENGHT;
  const showMismatchError =
    formInput.password !== "" &&
    formInput.confirmPassword !== "" &&
    formInput.password !== formInput.confirmPassword;
  const showTooShortError =
    formInput.password !== "" &&
    formInput.confirmPassword !== "" &&
    passwordsMatch &&
    !passwordLongEnough;
  return {
    allFieldsFilled: allFieldsFilled,
    emailFormatValid: emailFormatValid,
    passwordsMatch: passwordsMatch,
    passwordLongEnough: passwordLongEnough,
    showMismatchError: showMismatchError,
    showTooShortError: showTooShortError,
    allValid:
      allFieldsFilled &&
      emailFormatValid &&
      passwordsMatch &&
      passwordLongEnough &&
      formInput.privacyChecked,
  };
}

function renderPasswordErrors(evaluatedFormInput) {
  if (evaluatedFormInput.showMismatchError) {
    confirmationPasswordInput.classList.add("error");
    confirmationError.textContent =
      "Your passwords don't match. Please try again.";
    confirmationError.style.display = "block";
  } else if (evaluatedFormInput.showTooShortError) {
    confirmationPasswordInput.classList.add("error");
    confirmationError.textContent =
      "Your password must be at least 8 characters long";
    confirmationError.style.display = "block";
  } else {
    confirmationPasswordInput.classList.remove("error");
    confirmationError.textContent = "";
    confirmationError.style.display = "none";
  }
}

function setSignupButtonState(isFormValid) {
  signupButton.disabled = !isFormValid;
}

// function validateForm() {
//   let nameVal = nameInput.value.trim();
//   let emailVal = emailInput.value.trim();
//   let passVal = passwordInput.value; // ⚠️ kein trim bei Passwörtern
//   let confVal = confirmationPasswordInput.value;
//   let checked = checkbox.checked;

//   let notEmpty = nameVal !== "" && emailVal !== "" && passVal !== "" && confVal !== "";
//   let emailOk = isEmailValid(emailVal);
//   let passMatch = passVal !== "" && passVal === confVal;
//   let passLenOk = passVal.length >= PASSWORD_MIN_LENGHT;

//   let showMismatch = passVal !== "" && confVal !== "" && passVal !== confVal;
//   let showTooShort = passVal !== "" && confVal !== "" && passMatch && !passLenOk;

//   if (showMismatch) {
//     confirmationPasswordInput.classList.add("error");
//     confirmationError.textContent = "Your passwords don't match. Please try again.";
//     confirmationError.style.display = "block";
//   } else if (showTooShort) {
//     confirmationPasswordInput.classList.add("error");
//     confirmationError.textContent = "Your password must be at least 8 characters long";
//     confirmationError.style.display = "block";
//   } else {
//     confirmationPasswordInput.classList.remove("error");
//     confirmationError.textContent = "";
//     confirmationError.style.display = "none";
//   }

//   let allOk = notEmpty && emailOk && passMatch && passLenOk && checked;
//   signupButton.disabled = !allOk;
//   return allOk;
// }

// Hilfsfunktion für validateForm

function isEmailValid(email) {
  let regularExpression = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  return regularExpression.test(email);
}

// Bereinigung des Emailfeldes bei erneutem onfocus/oninput.
// Für denn Fall dass eine bereits benutzte Mailadresse bei registerUser verwendet wurde.

function clearEmailError() {
  if (confirmationError.textContent === USER_EXISTS_MSG) {
    emailInput.classList.remove("error");
    confirmationError.textContent = "";
    confirmationError.style.display = "none";
  }
}

// Sichtbarkeits-Handling der Passwort-Icons bei Eingabe des Passwortes sowie beim Anklicken des Icons.

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

function togglePasswordIconVisibility(inputId, iconId) {
  let input = document.getElementById(inputId);
  let icon = document.getElementById(iconId);
  if (input.value.length === 0) {
    input.type = "password";
    icon.src = "./assets/img/icons/form/lock.svg";
    icon.style.pointerEvents = "none";
    return;
  }
  if (input.type === "password") {
    input.type = "text";
    icon.src = "./assets/img/icons/form/visibility.svg";
  } else {
    input.type = "password";
    icon.src = "./assets/img/icons/form/visibility_off.svg";
  }
}
