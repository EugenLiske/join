// References to DOM elements and other variables

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

// Function for possible autofill. Password icons and button status are set correctly.

function initLoginAutoFill() {
  handleLoginPasswordInput("password_input", "login_password_icon");
  checkLoginEnable();
}
initLoginAutoFill();


// Firebase database: GET function for user data

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


function loginGuest(event) {
  event.preventDefault();
  setCurrentUserData(true, "guest", "");
  window.location.href='./pages/summary.html';
}


function setCurrentUserData(login, role, name){
    sessionStorage.setItem("login", login);
    sessionStorage.setItem("role", role);
    sessionStorage.setItem("name", name);  
}


// Auxiliary functions for the loginUser function

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
      window.location.href = "./pages/summary.html";
    }, 300);
  }, 1700);
}


// Validation function - activates the login button for valid entries

function checkLoginEnable() {loginUser
  let emailValue = emailInput.value.trim();
  let passwordValue = passwordInput.value;
  let emailOk = emailValue !== "" && isEmailValid(emailValue);
  let canLogin = emailOk && passwordValue !== "";
  loginButton.disabled = !canLogin;
  resetExistingLoginError();
}


// Help function for the checkLoginEnable function

function isEmailValid(email) {
  let regularExpression = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  return regularExpression.test(email);
}


// Clearing the error message when re-entering (oninput).
// In case an invalid email-password combination was entered in loginUser.

function resetExistingLoginError() {
  emailInput.classList.remove("error");
  passwordInput.classList.remove("error");
  if (loginErrorContainer) {
    loginErrorContainer.textContent = "";
    loginErrorContainer.style.display = "none";
  }
}


// Visibility handling of password icons when entering the password and when clicking on the icon.

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


// Fade in the static Flow logo when the animation is complete.

function showStaticLogoAfterAnimation() {
  let isSmallScreen = window.matchMedia('(max-width: 428px)').matches;
  if (!isSmallScreen) { return; }
  let staticLogo = document.querySelector('.header-logo .logo-static');
  if (!staticLogo) { return; }
  setTimeout(function(){
    staticLogo.classList.add('is-visible');
  }, 2000);
}


// Removes the bright intro logo after the splash fade (700ms)

function removeLightLogoAfterSplash() {
    let isSmallScreen = window.matchMedia('(max-width: 428px)').matches;
    if (!isSmallScreen) { return; }

    let lightLogo = document.querySelector('.logo--light');
    if (!lightLogo) { return; }

    setTimeout(function(){
      lightLogo.remove();
    }, 700);
  }


// Removes the dark fixed logo after the animation,so that only the static one remains in the flow.

function removeDarkFixedLogoAfterAnimation() {
  let isSmallScreen = window.matchMedia('(max-width: 428px)').matches;
  if (!isSmallScreen) { return; }
  let darkLogo = document.querySelector('.logo--dark');
  if (!darkLogo) { return; }

  setTimeout(function(){
    darkLogo.remove();
  }, 2000);
}


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


document.addEventListener('DOMContentLoaded', function () {
  const mq = window.matchMedia('(max-width: 428px)');
  const staticLogo = document.querySelector('.header-logo .logo-static');
  const animatedLogos = document.querySelectorAll('.logo_signup_page');
  let showTimer = null;
  let hideTimer = null;

function clearTimers() {
    if (showTimer) { clearTimeout(showTimer); showTimer = null; }
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
}


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


function enterDesktop() {
  clearTimers();
  if (staticLogo) {
    staticLogo.classList.remove('is-visible');
    staticLogo.style.display = 'none';
  }
  animatedLogos.forEach(el => { el.style.display = ''; });
}


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

