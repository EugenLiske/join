// References to DOM elements and other variables

/**
 * Email input field in the login form.
 * @type {HTMLInputElement}
 */
const emailInput          = document.getElementById("email_input");

/**
 * Password input field in the login form.
 * @type {HTMLInputElement}
 */
const passwordInput       = document.getElementById("password_input");

/**
 * Login (submit) button in the login form.
 * @type {HTMLButtonElement}
 */
const loginButton         = document.getElementById("login_button");

/**
 * Container for login error messages under the password field.
 * @type {HTMLDivElement}
 */
const loginErrorContainer = document.getElementById("login_error");

/**
 * Icon element on the right of the password field (lock/visibility).
 * @type {HTMLImageElement}
 */
const loginPwdIcon        = document.getElementById("login_password_icon");

/**
 * Fullscreen overlay container for success feedback.
 * @type {HTMLDivElement}
 */
const signupOverlay       = document.getElementById("signup_overlay");

/**
 * Message content shown inside the success overlay.
 * @type {HTMLDivElement}
 */
const overlayMessage      = document.getElementById("overlay_message");

/**
 * Alias to the password input used by the visibility toggle helpers.
 * @type {HTMLInputElement}
 */
const passwordInputField  = document.getElementById("password_input");

/**
 * Alias to the password visibility icon used by the helpers.
 * @type {HTMLImageElement}
 */
const passwordIcon        = document.getElementById("login_password_icon");

/**
 * Base URL of the Firebase Realtime Database (without .json).
 * @type {string}
 */
const BASE_URL = "https://join-test-c19be-default-rtdb.firebaseio.com";

// Function for possible autofill. Password icons and button status are set correctly.

/**
 * Initializes the login screen to correctly handle browser autofill:
 * sets the password icon state and enables/disables the login button accordingly.
 * @returns {void}
 */
function initLoginAutoFill() {
  handleLoginPasswordInput("password_input", "login_password_icon");
  checkLoginEnable();
}
initLoginAutoFill();


// Firebase database: GET function for user data

/**
 * Fetches data from the Firebase Realtime Database at a given path.
 * @async
 * @param {string} path - API path relative to {@link BASE_URL}, e.g., "/users".
 * @returns {Promise<any>} Resolved JSON payload (e.g., user object tree).
 * @throws {Error} If the request fails or returns a non-OK HTTP status.
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
 * Handles form-based login:
 * - Prevents default submit
 * - Validates email/password against the database
 * - Stores initials & user state in sessionStorage
 * - Shows success overlay and redirects to the summary page
 * @async
 * @param {Event} event - Submit event from the login form.
 * @returns {Promise<boolean>} true on success; false on temporary failure.
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
 * Performs a guest login and immediately redirects to the summary page.
 * @param {Event} event - Click event from the guest login button.
 * @returns {void}
 */
function loginGuest(event) {
  event.preventDefault();
  setCurrentUserData(true, "guest", "");
  window.location.href='./pages/summary.html';
}

/**
 * Persists login state, role, and name into sessionStorage.
 * @param {boolean} login - Login state (true if logged in).
 * @param {string} role - User role, e.g., "user" or "guest".
 * @param {string} name - Display name of the user (empty for guest).
 * @returns {void}
 */
function setCurrentUserData(login, role, name){
    sessionStorage.setItem("login", login);
    sessionStorage.setItem("role", role);
    sessionStorage.setItem("name", name);  
}


// Auxiliary functions for the loginUser function

/**
 * Finds a user in the response object that matches email and password.
 * @param {Record<string, any>} userResponse - User object tree from the database.
 * @param {string} emailValue - Email (already trimmed and lowercased).
 * @param {string} passwordValue - Plaintext password.
 * @returns {any|null} The matching user object or null if no match is found.
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
 * Checks a single user record for an exact email/password match.
 * @param {any} user - Single user object from the database.
 * @param {string} emailValue - Normalized email.
 * @param {string} passwordValue - Plaintext password.
 * @returns {boolean} true if both email and password match.
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
 * Stores user initials in sessionStorage if present.
 * @param {any} user - User object that may include an "initials" field.
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
 * Shows an error message for invalid email/password
 * and marks the input fields as invalid.
 * @returns {false} Always returns false to stop the login flow at this point.
 */
function showLoginErrorAndStop() {
  emailInput.classList.add("error");
  passwordInput.classList.add("error");
  loginErrorContainer.textContent = "Check your email and password. Please try again.";
  loginErrorContainer.style.display = "block";
  return false;
}

/**
 * Shows a generic error message for temporary technical issues during login.
 * @returns {void}
 */
function showGenericLoginError() {
  loginErrorContainer.textContent = "We couldn't sign you in right now. Please try again in a moment.";
  loginErrorContainer.style.display = "block";
}

/**
 * Displays the success overlay, plays its animation, and then redirects to the summary page.
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
 * Live-validates form fields and toggles the login button enabled state.
 * Also clears any existing error indicators/messages.
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
 * Validates an email address with a simple regular expression.
 * @param {string} email - Email address to validate.
 * @returns {boolean} true if the email matches the pattern.
 */
function isEmailValid(email) {
  let regularExpression = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  return regularExpression.test(email);
}


// Clearing the error message when re-entering (oninput).
// In case an invalid email-password combination was entered in loginUser.

/**
 * Clears existing error indicators and hides the login error message.
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
 * Updates password field icon and clickability depending on current value/type.
 * - Empty field: lock icon, clicks disabled
 * - Type "text": visibility (eye) icon
 * - Type "password": visibility_off (striked eye) icon
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
 * Toggles the password field visibility (password ⇄ text)
 * and updates the icon accordingly.
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
 * On very small screens (< 428px), fades in the static header logo after the animation completes.
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
 * On very small screens, removes the light (intro) logo after the splash fade.
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
 * On very small screens, removes the dark fixed logo after the animation ends.
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
 * Coordinates the smooth handover from animated logos to the static header logo
 * (fades in the static logo, then removes the animated variants).
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
 * Initializes responsive logo behavior based on the media query (≤ 428px).
 * Registers a listener and switches between animated and static logos as needed.
 */
document.addEventListener('DOMContentLoaded', function () {
  /**
   * MediaQueryList for very small screens.
   * @type {MediaQueryList}
   */
  const mq = window.matchMedia('(max-width: 428px)');

  /**
   * Static header logo element.
   * @type {HTMLImageElement|null}
   */
  const staticLogo = document.querySelector('.header-logo .logo-static');

  /**
   * Animated logo elements used for the intro animation.
   * @type {NodeListOf<HTMLElement>}
   */
  const animatedLogos = document.querySelectorAll('.logo_signup_page');

  /**
   * Timer for delayed fade-in of the static logo.
   * @type {number|null}
   */
  let showTimer = null;

  /**
   * Timer for delayed hiding/removal of animated logos.
   * @type {number|null}
   */
  let hideTimer = null;

  /**
   * Clears both timers to avoid race conditions when the MQ toggles quickly.
   * @returns {void}
   */
  function clearTimers() {
    if (showTimer) { clearTimeout(showTimer); showTimer = null; }
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  }

  /**
   * Applies the UI state for mobile mode (≤ 428px):
   * - Shows the static logo (faded in with delay)
   * - Hides/removes animated logos after the handover
   * @returns {void}
   */
  function enterMobile() {
    clearTimers();
    if (staticLogo) {
      staticLogo.style.display = 'block';      // exists on mobile
      staticLogo.classList.remove('is-visible'); // starts invisible (CSS fades in)
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
   * Applies the UI state for desktop mode (> 428px):
   * - Hides the static logo
   * - Shows animated logos (if they were hidden before)
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
   * Handles media query changes and switches between mobile and desktop states.
   * @param {MediaQueryListEvent|MediaQueryList} e - MQ change event or initial MQ list.
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
