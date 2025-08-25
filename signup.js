// ---------------------------------------------------------
// Globale DOM-Elemente → einmalig definieren
// ---------------------------------------------------------
const nameInput = document.getElementById("name_input");
const emailInput = document.getElementById("email_input");
const passInput = document.getElementById("password_input");
const confInput = document.getElementById("confirm_input");
const checkbox = document.getElementById("privacy_checkbox");
const signupBtn = document.getElementById("signup_button");
const confirmErr = document.getElementById("confirm_error");

const DUPLICATE_MSG =
  "This user exists already. Please use a different email address."; // NEW
// ---------------------------------------------------------

// beim Laden einmal prüfen (Autofill-Fälle) --> Button-Deaktivierung zu Beginn, da alle Felder leer sind
(function init() {
  validateForm();
})();

// Beim Laden: korrekte Start-Icons setzen (z. B. Autofill-Fälle)
(function initPwdIcons() {
  handlePwdInput("password_input", "password_icon");
  handlePwdInput("confirm_input", "confirm_icon");
})();

const BASE_URL = "https://join-test-c19be-default-rtdb.firebaseio.com";

function getInitials(rawName) {
  // 1) Eingabe sicher in einen String verwandeln und Ränder abschneiden
  let cleanName = String(rawName || "").trim();

  // 2) Wenn nach dem Trimmen nichts übrig ist → keine Initialen
  if (cleanName === "") {
    return "";
  }

  // 3) In "Wörter" aufspalten (beliebig viele Leerzeichen als Trenner)
  let nameParts = cleanName.split(/\s+/);

  // 4) Ersten Buchstaben des ersten Wortes vorbereiten
  let firstInitial = "";
  if (nameParts.length > 0 && nameParts[0].length > 0) {
    firstInitial = nameParts[0].charAt(0);
  }

  // 5) Ersten Buchstaben des letzten Wortes vorbereiten (nur wenn es >1 Wort gibt)
  let lastInitial = "";
  if (nameParts.length > 1) {
    let lastName = nameParts[nameParts.length - 1];
    if (lastName.length > 0) {
      lastInitial = lastName.charAt(0);
    }
  }

  // 6) Zusammenfügen und in Großbuchstaben konvertieren
  let initials = firstInitial + lastInitial;
  initials = initials.toUpperCase();

  // 7) Ergebnis zurückgeben (bei 1 Wort nur der erste Buchstabe, bei ≥2 Wörtern zwei Buchstaben)
  return initials;
}

async function getAllUsers(path) {
  let fireBaseResponse = await fetch(BASE_URL + path + ".json");
  let fireBaseResponseAsJson = await fireBaseResponse.json();
  return fireBaseResponseAsJson; // gibt Objekt oder null zurück
}

async function putUserData(path, data) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  let responseAsJson = await response.json();
  console.log(response);
  console.log(responseAsJson);
}

async function registerUser(event) {
  event.preventDefault();

  if (!validateForm()) {
    return false;
  }

  // (1) Alle bisherigen User aus Firebase holen
  let userResponse = await getAllUsers("/users");
  console.log(userResponse);

  // -------------------------------------------------
  // NEU: E-Mail-Duplikatsprüfung (ohne ternären Operator)
  // -------------------------------------------------
  confirmErr.textContent = "";
  confirmErr.style.display = "none";
  emailInput.classList.remove("error");

  let emailValForCheck = emailInput.value.trim().toLowerCase();
  let emailExists = false;

  if (userResponse) {
    let keys = Object.keys(userResponse); // ["user_1", "user_2", ...]

    for (let i = 0; i < keys.length; i++) {
      let k = keys[i];

      // Standard: leere Email
      let existing = "";

      // Prüfen, ob userResponse[k] existiert und ob es ein email-Feld gibt
      if (userResponse[k] && userResponse[k].email) {
        existing = String(userResponse[k].email).toLowerCase().trim();
      }

      // Vergleich mit der eingegebenen Email
      if (existing !== "" && existing === emailValForCheck) {
        emailExists = true;
        break; // Treffer → wir können abbrechen
      }
    }
  }

  if (emailExists) {
    emailInput.classList.add("error");
    confirmErr.textContent =
      "This user exists already. Please use a different email address.";
    confirmErr.style.display = "block";
    return false; // Abbruch der gesamten Funktion: kein Anlegen
  }

  // (2) Nächste freie User-ID berechnen
  let nextUserID = 1; // Standard: 1, falls DB leer
  if (userResponse) {
    let keys = Object.keys(userResponse); // ["user_1", "user_2"]
    let highestUserID = 0;

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]; // z. B. "user_2"

      if (key.startsWith("user_")) {
        let numberPart = key.substring(5); // "2"
        let n = parseInt(numberPart, 10);

        if (!isNaN(n) && n > highestUserID) {
          highestUserID = n; // größte Zahl merken
        }
      }
    }

    nextUserID = highestUserID + 1; // die nächste freie Nummer
  }

  // (3) Input-Werte lesen
  let nameVal = nameInput.value.trim();
  let emailVal = emailInput.value.trim().toLowerCase(); // (für DB speichern ggf. originaler Case)
  let passVal = passInput.value;

  // (4) Neues User-Objekt
  let user = {
    name: nameVal,
    email: emailVal,
    password: passVal,
    initials: getInitials(nameVal),
  };

  // (5) Pfad für den neuen User
  let path = "/users/user_" + nextUserID;

  // (6) User in Firebase speichern
  await putUserData(path, user);

  // (7) Overlay wie bisher
  let overlay = document.getElementById("signup_overlay");
  let msg = document.getElementById("overlay_message");

  overlay.classList.add("active");
  msg.classList.add("enter");

  setTimeout(function () {
    overlay.classList.add("leaving");
    setTimeout(function () {
      window.location.href = "login.html";
    }, 300);
  }, 2700);
}

function isEmailValid(email) {
  let regularExpression = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  return regularExpression.test(email);
}

function validateForm() {
  let nameVal = nameInput.value.trim();
  let emailVal = emailInput.value.trim();
  let passVal = passInput.value; // ⚠️ kein trim bei Passwörtern
  let confVal = confInput.value;
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
    confInput.classList.add("error");
    confirmErr.textContent = "Your passwords don't match. Please try again.";
    confirmErr.style.display = "block";
  } else if (showTooShort) {
    confInput.classList.add("error");
    confirmErr.textContent = "Your password must be at least 8 characters long";
    confirmErr.style.display = "block";
  } else {
    confInput.classList.remove("error");
    // Nur leeren, wenn aktuell KEINE E-Mail-Duplikatmeldung angezeigt wird
    if (confirmErr.textContent !== DUPLICATE_MSG) {
      // NEW (sanft)
      confirmErr.textContent = "";
      confirmErr.style.display = "none";
    }
  }

  let allOk = notEmpty && emailOk && passMatch && passLenOk && checked;
  signupBtn.disabled = !allOk;
  return allOk;
}

// Sichtbarkeits-Handling (wie gehabt)
function handlePwdInput(inputId, iconId) {
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

function toggleVisibility(inputId, iconId) {
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

// -------------------- UX-Politur --------------------
// E-Mail-Fehler ausblenden, sobald der User im E-Mail-Feld arbeitet
function clearEmailError() {
  // NEW
  emailInput.classList.remove("error");
  if (confirmErr.textContent === DUPLICATE_MSG) {
    confirmErr.textContent = "";
    confirmErr.style.display = "none";
  }
}

//------- Testfunktion und Übungen

// let users = [];

// async function testUpload() {
//   let userResponse = await getAllUsers("/users");
//   let userKeysArray = Object.keys(userResponse);

//   for (let index = 0; index < userKeysArray.length; index++) {
//     users.push({
//       id: userKeysArray[index],
//       name: userResponse[userKeysArray[index]].name,
//       email: userResponse[userKeysArray[index]].email,
//       password: userResponse[userKeysArray[index]].password,
//     });
//   }

//   console.log(userResponse);
//   console.log(userKeysArray);
//   console.log(users);

//   await addSingleUser();
// }

// async function addSingleUser(
//   id = 1,
//   user = { name: "Brooke", email: "eugen.liske@gmx.de", password: "top_secret" }
// ) {
//   await putUserData(`/users/user_${id}`, user);
// }

// async function putUserData(path, data) {
//   let response = await fetch(BASE_URL + path + ".json", {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   let responseAsJson = await response.json();
//   // console.log(response);
//   // console.log(responseAsJson);
// }

// Alle User aus der Firebase DB ziehen. Der übergebene Pfad ist /users. Alle User werden damit adressiert.

// async function getAllUsers(path) {
//   let fireBaseResponse = await fetch(BASE_URL + path + ".json");
//   let fireBaseResponseAsJson = await fireBaseResponse.json();

//   return fireBaseResponseAsJson;
// }
