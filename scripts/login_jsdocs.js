// References to DOM elements and other variables

/**
 * E-Mail-Eingabefeld im Login-Formular.
 * @type {HTMLInputElement}
 */
const emailInput          = document.getElementById("email_input");

/**
 * Passwort-Eingabefeld im Login-Formular.
 * @type {HTMLInputElement}
 */
const passwordInput       = document.getElementById("password_input");

/**
 * Login-Button (Submit) im Login-Formular.
 * @type {HTMLButtonElement}
 */
const loginButton         = document.getElementById("login_button");

/**
 * Container für Login-Fehlermeldungen unter dem Passwortfeld.
 * @type {HTMLDivElement}
 */
const loginErrorContainer = document.getElementById("login_error");

/**
 * Icon-Element rechts im Passwortfeld (Lock/Visibility).
 * @type {HTMLImageElement}
 */
const loginPwdIcon        = document.getElementById("login_password_icon");

/**
 * Vollflächiger Overlay-Container für Erfolgsanzeige.
 * @type {HTMLDivElement}
 */
const signupOverlay       = document.getElementById("signup_overlay");

/**
 * Nachricht im Overlay (Erfolgs-Feedback).
 * @type {HTMLDivElement}
 */
const overlayMessage      = document.getElementById("overlay_message");

/**
 * Alias auf das Passwortfeld für die Visibility-Steuerung.
 * @type {HTMLInputElement}
 */
const passwordInputField  = document.getElementById("password_input");

/**
 * Alias auf das Passwort-Icon für die Visibility-Steuerung.
 * @type {HTMLImageElement}
 */
const passwordIcon        = document.getElementById("login_password_icon");

/**
 * Basis-URL der Firebase Realtime Database (ohne .json).
 * @type {string}
 */
const BASE_URL = "https://join-test-c19be-default-rtdb.firebaseio.com";

// Function for possible autofill. Password icons and button status are set correctly.

/**
 * Initialisiert den Login-Screen, um Autofill-Fälle korrekt zu behandeln
 * (setzt Icon-Status für das Passwortfeld und aktiviert/deaktiviert den Login-Button).
 * @returns {void}
 */
function initLoginAutoFill() {
  handleLoginPasswordInput("password_input", "login_password_icon");
  checkLoginEnable();
}
initLoginAutoFill();


// Firebase database: GET function for user data

/**
 * Lädt alle Benutzer aus der Firebase Realtime Database.
 * @async
 * @param {string} path - API-Pfad relativ zu {@link BASE_URL}, z. B. "/users".
 * @returns {Promise<any>} Aufgelöster JSON-Inhalt der Antwort (Benutzer-Objektbaum).
 * @throws {Error} Wenn der Netzwerkaufruf fehlschlägt oder ein HTTP-Fehlerstatus vorliegt.
 */
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


// Login function (login button)

/**
 * Handhabt den Login-Vorgang über das Formular:
 * - Verhindert Standard-Submit
 * - Prüft E-Mail/Passwort gegen Datenbank
 * - Speichert Initialen & Nutzerstatus in Session Storage
 * - Zeigt Erfolgs-Overlay und leitet zur Summary-Seite weiter
 * @async
 * @param {Event} event - Submit-Event des Login-Formulars.
 * @returns {Promise<boolean>} true bei Erfolg, false bei (vorübergehendem) Fehler.
 */
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
    setCurrentUserData(true, "user", matchedUser.name)
    return true;
  } catch (error) {
    console.error("loginUser failed:", error);
    showGenericLoginError();
    return false;
  }
}

/**
 * Führt einen Gast-Login aus und leitet direkt auf die Summary-Seite weiter.
 * @param {Event} event - Klick-Event des Gast-Login-Buttons.
 * @returns {void}
 */
function loginGuest(event) {
  event.preventDefault();
  setCurrentUserData(true, "guest", "");
  window.location.href='./pages/summary.html';
}

/**
 * Persistiert Login-Zustand, Rolle und Name in der Session Storage.
 * @param {boolean} login - Login-Status (eingeloggt ja/nein).
 * @param {string} role - Rolle des Benutzers, z. B. "user" oder "guest".
 * @param {string} name - Anzeigename des Benutzers (optional leer für Gast).
 * @returns {void}
 */
function setCurrentUserData(login, role, name){
    sessionStorage.setItem("login", login);
    sessionStorage.setItem("role", role);
    sessionStorage.setItem("name", name);  
}


// Auxiliary functions for the loginUser function

/**
 * Sucht in der Benutzerantwort nach einem Eintrag, der E-Mail und Passwort entspricht.
 * @param {Record<string, any>} userResponse - Objektbaum der Benutzer aus der Datenbank.
 * @param {string} emailValue - E-Mail (bereits getrimmt und kleingeschrieben).
 * @param {string} passwordValue - Passwort im Klartext.
 * @returns {any|null} Das gefundene Benutzerobjekt oder null, wenn kein Treffer.
 */
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

/**
 * Prüft einen einzelnen Benutzer-Datensatz auf Übereinstimmung mit E-Mail und Passwort.
 * @param {any} user - Einzelnes Benutzerobjekt aus der Datenbank.
 * @param {string} emailValue - E-Mail (bereits normalisiert).
 * @param {string} passwordValue - Passwort im Klartext.
 * @returns {boolean} true, wenn E-Mail und Passwort übereinstimmen.
 */
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

/**
 * Speichert vorhandene Initialen des Users in der Session Storage.
 * @param {any} user - Benutzerobjekt mit möglichem "initials"-Feld.
 * @returns {void}
 */
function storeUserInitials(user) {
  if (user && user.initials) {
    let initials = String(user.initials);
    if (initials !== "") {
      sessionStorage.setItem("initials", initials);
    }
  }
}

/**
 * Zeigt eine Fehlermeldung bei ungültiger E-Mail/Passwort-Kombination
 * und markiert die Eingabefelder als fehlerhaft.
 * @returns {false} Immer false, um den Login-Prozess an dieser Stelle zu beenden.
 */
function showLoginErrorAndStop() {
  emailInput.classList.add("error");
  passwordInput.classList.add("error");
  loginErrorContainer.textContent = "Check your email and password. Please try again.";
  loginErrorContainer.style.display = "block";
  return false;
}

/**
 * Zeigt eine generische Fehlermeldung bei technischen Problemen im Login-Prozess.
 * @returns {void}
 */
function showGenericLoginError() {
  loginErrorContainer.textContent = "We couldn't sign you in right now. Please try again in a moment.";
  loginErrorContainer.style.display = "block";
}

/**
 * Blendet das Erfolgs-Overlay ein, animiert es und leitet anschließend zur Summary-Seite weiter.
 * @returns {void}
 */
function createSuccessOverlayLogin() {
  signupOverlay.classList.add("active");
  overlayMessage.classList.add("enter");
  setTimeout(function () {
    signupOverlay.classList.add("leaving");
    setTimeout(function () {
      window.location.href = "./pages/summary.html";
    }, 300);
  }, 1700);
}


// Validation function - activates the login button for valid entries

/**
 * Validiert die Formularfelder live und aktiviert/deaktiviert den Login-Button.
 * Zudem werden vorhandene Fehlermarkierungen/-meldungen zurückgesetzt.
 * @returns {void}
 */
function checkLoginEnable() {loginUser
  let emailValue = emailInput.value.trim();
  let passwordValue = passwordInput.value;
  let emailOk = emailValue !== "" && isEmailValid(emailValue);
  let canLogin = emailOk && passwordValue !== "";
  loginButton.disabled = !canLogin;
  resetExistingLoginError();
}


// Help function for the checkLoginEnable function

/**
 * Prüft eine E-Mail-Adresse mit einer einfachen Regex auf formale Gültigkeit.
 * @param {string} email - Zu prüfende E-Mail-Adresse.
 * @returns {boolean} true, wenn die E-Mail dem Muster entspricht.
 */
function isEmailValid(email) {
  let regularExpression = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  return regularExpression.test(email);
}


// Clearing the error message when re-entering (oninput).
// In case an invalid email-password combination was entered in loginUser.

/**
 * Entfernt evtl. vorhandene Fehlermarkierungen und blendet die Fehlermeldung aus.
 * @returns {void}
 */
function resetExistingLoginError() {
  emailInput.classList.remove("error");
  passwordInput.classList.remove("error");
  if (loginErrorContainer) {
    loginErrorContainer.textContent = "";
    loginErrorContainer.style.display = "none";
  }
}


// Visibility handling of password icons when entering the password and when clicking on the icon.

/**
 * Aktualisiert das Icon und die Klickbarkeit im Passwortfeld abhängig vom aktuellen Inhalt/Typ.
 * - Leeres Feld: Schloss-Icon, keine Klicks
 * - Typ "text": Sichtbar-Icon
 * - Typ "password": Versteckt-Icon
 * @returns {void}
 */
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

/**
 * Schaltet die Sichtbarkeit des Passwortfeldes um (password ⇄ text)
 * und passt das Icon entsprechend an.
 * @returns {void}
 */
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


// Fade in the static Flow logo when the animation is complete.

/**
 * Blendet auf sehr kleinen Screens (< 428px) das statische Header-Logo nach der Animation weich ein.
 * @returns {void}
 */
function showStaticLogoAfterAnimation() {
  let isSmallScreen = window.matchMedia('(max-width: 428px)').matches;
  if (!isSmallScreen) { return; }
  let staticLogo = document.querySelector('.header-logo .logo-static');
  if (!staticLogo) { return; }
  setTimeout(function(){
    staticLogo.classList.add('is-visible');
  }, 2000);
}

/**
 * Entfernt auf sehr kleinen Screens das helle (intro) Logo nach dem Splash-Fade.
 * @returns {void}
 */
function removeLightLogoAfterSplash() {
    let isSmallScreen = window.matchMedia('(max-width: 428px)').matches;
    if (!isSmallScreen) { return; }

    let lightLogo = document.querySelector('.logo--light');
    if (!lightLogo) { return; }

    setTimeout(function(){
      lightLogo.remove();
    }, 700);
  }

/**
 * Entfernt auf sehr kleinen Screens das dunkle, fixierte Logo nach Ende der Animation.
 * @returns {void}
 */
function removeDarkFixedLogoAfterAnimation() {
  let isSmallScreen = window.matchMedia('(max-width: 428px)').matches;
  if (!isSmallScreen) { return; }
  let darkLogo = document.querySelector('.logo--dark');
  if (!darkLogo) { return; }

  setTimeout(function(){
    darkLogo.remove();
  }, 2000);
}

/**
 * Koordiniert sanfte Übergabe von animierten Logos zum statischen Header-Logo
 * (Einblenden des statischen Logos, Entfernen der animierten Varianten).
 * @returns {void}
 */
function smoothLogoHandover() {
  let isSmallScreen = window.matchMedia('(max-width: 428px)').matches;
  if (!isSmallScreen) { return; }
  let staticLogo = document.querySelector('.header-logo .logo-static');
  if (staticLogo) {
    setTimeout(function () {
      staticLogo.classList.add('is-visible');
    }, 1800); 
  }
  let animatedLogos = document.querySelectorAll('.logo_signup_page');
  if (animatedLogos && animatedLogos.length > 0) {
    setTimeout(function () {
      for (let i = 0; i < animatedLogos.length; i++) {
        animatedLogos[i].remove();
      }
    }, 2100);
  }
}

showStaticLogoAfterAnimation();
removeLightLogoAfterSplash();
removeDarkFixedLogoAfterAnimation();
smoothLogoHandover();

/**
 * Initialisiert responsives Logo-Verhalten abhängig vom Media Query (≤ 428px).
 * Registriert Listener und steuert Sichtbarkeit/Übergänge zwischen animierten und statischen Logos.
 */
document.addEventListener('DOMContentLoaded', function () {
  /**
   * MediaQueryList für sehr kleine Screens.
   * @type {MediaQueryList}
   */
  const mq = window.matchMedia('(max-width: 428px)');

  /**
   * Statisches Header-Logo-Element.
   * @type {HTMLImageElement|null}
   */
  const staticLogo = document.querySelector('.header-logo .logo-static');

  /**
   * Liste animierter Logo-Elemente für die Intro-Animation.
   * @type {NodeListOf<HTMLElement>}
   */
  const animatedLogos = document.querySelectorAll('.logo_signup_page');

  /**
   * Timer für verzögertes Einblenden des statischen Logos.
   * @type {number|null}
   */
  let showTimer = null;

  /**
   * Timer für verzögertes Ausblenden/Entfernen der animierten Logos.
   * @type {number|null}
   */
  let hideTimer = null;

  /**
   * Löscht beide Zeitgeber, um Race Conditions bei schnellen MQ-Wechseln zu vermeiden.
   * @returns {void}
   */
  function clearTimers() {
    if (showTimer) { clearTimeout(showTimer); showTimer = null; }
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  }

  /**
   * Stellt den UI-Zustand für den mobilen Modus (≤ 428px) her:
   * - Statisches Logo einblenden (verzögert)
   * - Animierte Logos nach Übergabe ausblenden/entfernen
   * @returns {void}
   */
  function enterMobile() {
    clearTimers();
    if (staticLogo) {
      staticLogo.style.display = 'block';      // in Mobile existiert es
      staticLogo.classList.remove('is-visible'); // beginnt unsichtbar (CSS blendet weich ein)
    }
    animatedLogos.forEach(el => { el.style.display = ''; });
    showTimer = setTimeout(() => {
    staticLogo && staticLogo.classList.add('is-visible');
    }, 1800);
    hideTimer = setTimeout(() => {
      animatedLogos.forEach(el => { el.style.display = 'none'; });
    }, 2100);
  }

  /**
   * Stellt den UI-Zustand für den Desktop-Modus (> 428px) her:
   * - Statisches Logo verstecken
   * - Animierte Logos wieder anzeigen (falls zuvor ausgeblendet)
   * @returns {void}
   */
  function enterDesktop() {
    clearTimers();
    if (staticLogo) {
      staticLogo.classList.remove('is-visible');
      staticLogo.style.display = 'none';
    }
    animatedLogos.forEach(el => { el.style.display = ''; });
  }

  /**
   * Reagiert auf Änderungen des Media Queries und schaltet zwischen Mobile- und Desktop-Zustand.
   * @param {MediaQueryListEvent|MediaQueryList} e - MQ-Änderungsereignis oder initiale Liste.
   * @returns {void}
   */
  function handleChange(e) {
    if (e.matches) {
      enterMobile();
    } else {
      enterDesktop();
    }
  }

  mq.addEventListener('change', handleChange);
  handleChange(mq);
});
