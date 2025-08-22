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

// Helfer: Daten aus Firebase lesen
async function getAllUsers(path) {
  let fireBaseResponse = await fetch(BASE_URL + path + ".json");
  let fireBaseResponseAsJson = await fireBaseResponse.json();
  return fireBaseResponseAsJson; // gibt Objekt oder null zurück
}

// Helfer: PUT in Firebase
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

// === Register-Funktion ===
async function registerUser(event) {
  event.preventDefault(); // Form-Reload verhindern

  if (!validateForm()) {
    return false; // Sicherheitsnetz
  }

  // (1) Alle bisherigen User aus Firebase holen
  let userResponse = await getAllUsers("/users");

  // (2) Nächste freie ID berechnen
  let nextUserID = 1; // Standard: 1, falls DB leer
  if (userResponse) {
    let keys = Object.keys(userResponse); // ["user_1", "user_2", ...]
    let highestUserID = 0;

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]; // z. B. "user_7"

      if (key.startsWith("user_")) {

        let numberPart = key.substring(5); // "7"
        let n = parseInt(numberPart, 10);
        
        if (!isNaN(n) && n > highestUserID) {
          highestUserID = n; // größte Zahl merken
        }
      }
    }

    nextUserID = highestUserID + 1; // die nächste freie Nummer
  }

  // (3) Input-Werte lesen
  let nameVal = document.getElementById("name_input").value.trim();
  let emailVal = document.getElementById("email_input").value.trim();
  let passVal = document.getElementById("password_input").value;

  // (4) Neues User-Objekt
  let user = {
    id: nextUserID,
    name: nameVal,
    email: emailVal,
    password: passVal,
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
  let nameInput = document.getElementById("name_input");
  let emailInput = document.getElementById("email_input");
  let passInput = document.getElementById("password_input");
  let confInput = document.getElementById("confirm_input");
  let checkbox = document.getElementById("privacy_checkbox");
  let button = document.getElementById("signup_button");
  let confirmErr = document.getElementById("confirm_error");

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

  // Fehlerlogik:
  // 1) Wenn unterschiedlich → "don't match"
  // 2) Wenn gleich aber zu kurz → "must be at least 8..."
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
    confirmErr.textContent = "";
    confirmErr.style.display = "none";
  }

  // Button nur freigeben, wenn ALLES passt (inkl. Länge)
  let allOk = notEmpty && emailOk && passMatch && passLenOk && checked;

  button.disabled = !allOk;
  return allOk;
}

// Zeigt abhängig vom Feldzustand das richtige Icon an.
function handlePwdInput(inputId, iconId) {
  let input = document.getElementById(inputId);
  let icon = document.getElementById(iconId);

  if (input.value.length === 0) {
    // Feld leer → Schloss zeigen, wieder verstecken, Icon nicht klickbar
    input.type = "password";
    icon.src = "./assets/img/icons/form/lock.svg";
    icon.style.pointerEvents = "none";
    return;
  }

  // Feld hat Text → Icon klickbar
  icon.style.pointerEvents = "auto";

  // Sichtbar? → offenes Auge; sonst → durchgestrichenes Auge
  if (input.type === "text") {
    icon.src = "./assets/img/icons/form/visibility.svg";
  } else {
    icon.src = "./assets/img/icons/form/visibility_off.svg";
  }
}

// Klick auf das Icon schaltet Sichtbarkeit + Icon um.
function toggleVisibility(inputId, iconId) {
  let input = document.getElementById(inputId);
  let icon = document.getElementById(iconId);

  // Nichts zu togglen, wenn leer → Schloss + versteckt
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