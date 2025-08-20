const BASE_URL = "https://console.firebase.google.com/project/join-test-c19be/database/join-test-c19be-default-rtdb/data/~2F";

// beim Laden einmal prüfen (Autofill-Fälle) --> Button-Deaktivierung zu Beginn, da alle Felder leer sind
(function init() {
  validateForm();
})();

//-------------------------------Registrierten User in die Datenbank hochladen--------------------------//


// 1) Deine Realtime-Database REST-URL (ohne .json am Ende)
const DB_URL = 'https://join-test-c19be-default-rtdb.firebaseio.com';

/** 2) Hilfsfunktion: URL bauen (fügt .json an) */
function dbUrl(path) {
  // Entfernt mögliche führende/abschließende Slashes und hängt .json an
  const clean = String(path).replace(/^\/+|\/+$/g, '');
  return `${DB_URL}/${clean}.json`;
}

/** 3) Nächsten Key im Format user_N bestimmen (liest vorhandene Keys aus) */
function nextUserKey(existingObj) {
  if (!existingObj || typeof existingObj !== 'object') return 'user_1';
  let max = 0;
  for (const key of Object.keys(existingObj)) {
    const m = key.match(/^user_(\d+)$/);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return `user_${max + 1}`;
}

/** 4) Registrierung: liest Inputs, baut JSON, PUT nach /users/user_N */
async function registerUser(event, collectionPath) {
  event.preventDefault();                 // (a) Standard-Submit verhindern (Seiten-Reload)

  // (b) Sicherheitsnetz: Deine bestehende Validierung erneut prüfen
  if (typeof validateForm === 'function' && !validateForm()) return false;

  // (c) Eingaben auslesen
  const nameVal  = document.getElementById('name_input').value.trim();
  const emailVal = document.getElementById('email_input').value.trim();
  const passVal  = document.getElementById('password_input').value; // kein trim bei Passwörtern

  // (d) JSON-Objekt für die DB (Hinweis: Plaintext-Passwort ist nur zu Übungszwecken!)
  const userObj = { name: nameVal, email: emailVal, password: passVal };

  // (e) Button gegen Doppelklicks sperren
  const btn = document.getElementById('signup_button');
  if (btn) btn.disabled = true;

  try {
    // (f) Bestehende users laden, um nächste Nummer zu finden
    const listRes = await fetch(dbUrl(collectionPath));      // z.B. GET …/users.json
    if (!listRes.ok) throw new Error(`Read failed: ${listRes.status}`);
    const listData = await listRes.json();                   // Objekt aller bisherigen user_N oder null

    // (g) Nächsten Key bestimmen (user_1, user_2, …)
    const key = nextUserKey(listData);

    // (h) Mit PUT exakt unter /users/user_N schreiben (kein Auto-ID)
    const putRes = await fetch(dbUrl(`${collectionPath}/${key}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userObj)
    });
    if (!putRes.ok) {
      const t = await putRes.text().catch(() => '');
      throw new Error(`PUT failed: ${putRes.status} ${t}`);
    }

    // (i) Erfolg → dein Overlay-Flow
    const overlay = document.getElementById('signup_overlay');
    const msg     = document.getElementById('overlay_message');
    if (overlay && msg) {
      overlay.classList.add('active');
      msg.classList.add('enter');

      setTimeout(function () {
        overlay.classList.add('leaving');
        setTimeout(function () {
          window.location.href = 'login.html';
        }, 300);
      }, 2700);
    } else {
      // Fallback, falls Overlay nicht vorhanden ist
      window.location.href = 'login.html';
    }
  } catch (err) {
    console.error(err);
    alert('Saving to database failed. Please try again.');
    if (btn) btn.disabled = false;       // (j) Button wieder freigeben
    return false;
  }
}


//-------------------------------Registrierten User in die Datenbank hochladen--------------------------//

// function registerUser(event) {
//     // verhindert sofortiges Reload/Submit
//     event.preventDefault();

//     // Sicherheitsnetz
//     if (!validateForm()) {
//         return false;
//     } 

//     let overlay = document.getElementById('signup_overlay');
//     let msg = document.getElementById('overlay_message');

//     // Overlay sichtbar machen
//     overlay.classList.add('active');

//     // Message einfahren
//     msg.classList.add('enter');

//     // Nach 2.7s ausblenden und weiterleiten
//     setTimeout(function () {
//       overlay.classList.add('leaving');
//       setTimeout(function () {
//         window.location.href = 'login.html';
//       }, 300);
//     }, 2700);
// }

function isEmailValid(email) {
    let regularExpression = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
    return regularExpression.test(email);
}

function validateForm() {
  let nameInput  = document.getElementById('name_input');
  let emailInput = document.getElementById('email_input');
  let passInput  = document.getElementById('password_input');
  let confInput  = document.getElementById('confirm_input');
  let checkbox   = document.getElementById('privacy_checkbox');
  let button     = document.getElementById('signup_button');
  let confirmErr = document.getElementById('confirm_error');

  let nameVal  = nameInput.value.trim();
  let emailVal = emailInput.value.trim();
  let passVal  = passInput.value;   // ⚠️ kein trim bei Passwörtern
  let confVal  = confInput.value;
  let checked  = checkbox.checked;

  const MIN_LEN = 8;

  let notEmpty     = (nameVal !== '' && emailVal !== '' && passVal !== '' && confVal !== '');
  let emailOk      = isEmailValid(emailVal);
  let passMatch    = (passVal !== '' && passVal === confVal);
  let passLenOk    = (passVal.length >= MIN_LEN);

  // Fehlerlogik:
  // 1) Wenn unterschiedlich → "don't match"
  // 2) Wenn gleich aber zu kurz → "must be at least 8..."
  let showMismatch = (passVal !== '' && confVal !== '' && passVal !== confVal);
  let showTooShort = (passVal !== '' && confVal !== '' && passMatch && !passLenOk);

  if (showMismatch) {
    confInput.classList.add('error');
    confirmErr.textContent = "Your passwords don't match. Please try again.";
    confirmErr.style.display = 'block';
  } else if (showTooShort) {
    confInput.classList.add('error');
    confirmErr.textContent = "Your password must be at least 8 characters long";
    confirmErr.style.display = 'block';
  } else {
    confInput.classList.remove('error');
    confirmErr.textContent = '';
    confirmErr.style.display = 'none';
  }

  // Button nur freigeben, wenn ALLES passt (inkl. Länge)
  let allOk = notEmpty && emailOk && passMatch && passLenOk && checked;

  button.disabled = !allOk;
  return allOk;
}

  // Zeigt abhängig vom Feldzustand das richtige Icon an.
  function handlePwdInput(inputId, iconId) {
    let input = document.getElementById(inputId);
    let icon  = document.getElementById(iconId);

    if (input.value.length === 0) {
      // Feld leer → Schloss zeigen, wieder verstecken, Icon nicht klickbar
      input.type = 'password';
      icon.src   = './assets/img/icons/form/lock.svg';
      icon.style.pointerEvents = 'none';
      return;
    }

    // Feld hat Text → Icon klickbar
    icon.style.pointerEvents = 'auto';

    // Sichtbar? → offenes Auge; sonst → durchgestrichenes Auge
    if (input.type === 'text') {
      icon.src = './assets/img/icons/form/visibility.svg';
    } else {
      icon.src = './assets/img/icons/form/visibility_off.svg';
    }
  }

    // Klick auf das Icon schaltet Sichtbarkeit + Icon um.
  function toggleVisibility(inputId, iconId) {
    let input = document.getElementById(inputId);
    let icon  = document.getElementById(iconId);

    // Nichts zu togglen, wenn leer → Schloss + versteckt
    if (input.value.length === 0) {
      input.type = 'password';
      icon.src   = './assets/img/icons/form/lock.svg';
      icon.style.pointerEvents = 'none';
      return false;
    }

    if (input.type === 'password') {
      input.type = 'text';
      icon.src   = './assets/img/icons/form/visibility.svg';
    } else {
      input.type = 'password';
      icon.src   = './assets/img/icons/form/visibility_off.svg';
    }

    return false;
  }

  // Beim Laden: korrekte Start-Icons setzen (z. B. Autofill-Fälle)
  (function initPwdIcons() {
    handlePwdInput('password_input','password_icon');
    handlePwdInput('confirm_input','confirm_icon');
  })();
  
