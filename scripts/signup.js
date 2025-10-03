// References to DOM elements and other variables

const nameInput                   = document.getElementById("name_input");
const emailInput                  = document.getElementById("email_input");
const passwordInput               = document.getElementById("password_input");
const confirmationPasswordInput   = document.getElementById("confirm_input");
const checkbox                    = document.getElementById("privacy_checkbox");
const signupButton                = document.getElementById("signup_button");
const confirmationError           = document.getElementById("confirm_error");
const emailError                  = document.getElementById("email_error");
const signupOverlay               = document.getElementById("signup_overlay");
const overlayMessage              = document.getElementById("overlay_message");
const USER_EXISTS_MSG             = "This user exists already. Please use a different email address.";
const EMAIL_INVALID_MSG           = "Please enter a valid email address.";
const PASSWORD_MIN_LENGTH         = 8;
const BASE_URL                    = "https://join-test-c19be-default-rtdb.firebaseio.com";

// Function for possible autofill. Password icons and button status are set correctly.


function initAutoFill() {
  validateForm();
  handlePasswordInput("password_input", "password_icon");
  handlePasswordInput("confirm_input", "confirm_icon");
}
initAutoFill();


// Firebase database: GET and PUT functions for user data

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


async function putUserData(path, data) {
  try {
    let fireBaseResponse = await fetch(BASE_URL + path + ".json", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!fireBaseResponse.ok) {
      throw new Error(`PUT ${path} failed: ${fireBaseResponse.status} ${fireBaseResponse.statusText}`);
    }
  } catch (error) {
    console.error("putUserData error:", error);
    throw error;
  }
}


// Registration function (Sign Up button)

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
    createSuccessOverlaySignUp();
  } catch (error) {
    console.error("registerUser failed:", error);
    return false;
  }
}


// Helper functions for the registerUser function

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
      existingEmail = String(userResponse[singleUserKey].email).toLowerCase().trim();
    }
    if (existingEmail !== "" && existingEmail === emailToCheck) {
      return true;
    }
  }
  return false;
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
      if (!isNaN(userIdNumber) && userIdNumber > highestUserID) highestUserID = userIdNumber; 
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


function createSuccessOverlaySignUp() {
  signupOverlay.classList.add("active");
  overlayMessage.classList.add("enter");
  setTimeout(function () {
    signupOverlay.classList.add("leaving");
    setTimeout(function () {
      window.location.href = "../index.html";
    }, 300);
  }, 2700);
}


// Validation function - activates the sign-up button when valid entries are made

function validateForm() {
  const formInput = readFormInput();
  const evaluatedFormInput = evaluateFormInput(formInput);
  renderPasswordErrors(evaluatedFormInput);
  setSignupButtonState(evaluatedFormInput.allValid);
  return evaluatedFormInput.allValid;
}


// Auxiliary functions for the validateForm function

function readFormInput() {
  return {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value,
    confirmPassword: confirmationPasswordInput.value,
    privacyChecked: checkbox.checked,
  };
}


function evaluateFormInput(formInput) {
  const allFieldsFilled = (formInput.name !== "" && formInput.email !== "") && (formInput.password !== "" && formInput.confirmPassword !== "");
  const emailFormatValid = isEmailValid(formInput.email);
  const passwordLongEnough = formInput.password.length >= PASSWORD_MIN_LENGTH;
  const passwordsMatch = (formInput.password !== "" && formInput.confirmPassword !== "") && (formInput.password === formInput.confirmPassword);
  const showMismatchError = (formInput.password !== "" && formInput.confirmPassword !== "") && (formInput.password !== formInput.confirmPassword);
  const showTooShortError = (formInput.password !== "" && formInput.confirmPassword !== "") && passwordsMatch && !passwordLongEnough;
  return {
    allFieldsFilled: allFieldsFilled,
    emailFormatValid: emailFormatValid,
    passwordsMatch: passwordsMatch,
    passwordLongEnough: passwordLongEnough,
    showMismatchError: showMismatchError,
    showTooShortError: showTooShortError,
    allValid: allFieldsFilled && emailFormatValid && passwordsMatch && passwordLongEnough && formInput.privacyChecked,
  };
}


function renderPasswordErrors(evaluatedFormInput) {
  emailError.textContent = "";
  emailError.style.display = "none";
  if (evaluatedFormInput.showMismatchError) {
    confirmationPasswordInput.classList.add("error");
    confirmationError.textContent = "Your passwords don't match. Please try again.";
    confirmationError.style.display = "block";
  } else if (evaluatedFormInput.showTooShortError) {
    confirmationPasswordInput.classList.add("error");
    confirmationError.textContent = "Your password must be at least 8 characters long";
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


function isEmailValid(email) {
  let regularExpression = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  return regularExpression.test(email);
}

// Fixing the error message when re-entering (i.e., onfocus/oninput).
// In case an email address that has already been used was entered in registerUser.
// And if no valid email address was entered.

function clearEmailError() {
  emailInput.classList.remove("error");
  emailError.textContent = "";
  emailError.style.display = "none";
}


// Error message when clicking out of the email field and invalid email

function validateEmailOnBlur() {
  const value = emailInput.value.trim();

  if (value !== "" && !isEmailValid(value)) {
    emailInput.classList.add("error");
    emailError.textContent = EMAIL_INVALID_MSG;
    emailError.style.display = "block";
    confirmationError.textContent = "";
    confirmationError.style.display = "none";
  }
}


// Visibility handling of password icons when entering the password and when clicking on the icon.

function handlePasswordInput(inputId, iconId) {
  let input = document.getElementById(inputId);
  let icon = document.getElementById(iconId);
  if (input.value.length === 0) {
    input.type = "password";
    icon.src = "../assets/img/icons/form/lock.svg";
    icon.style.pointerEvents = "none";
    return;
  }
  icon.style.pointerEvents = "auto";
  if (input.type === "text") {
    icon.src = "../assets/img/icons/form/visibility.svg";
  } else {
    icon.src = "../assets/img/icons/form/visibility_off.svg";
  }
}


function togglePasswordIconVisibility(inputId, iconId) {
  let input = document.getElementById(inputId);
  let icon = document.getElementById(iconId);
  if (input.value.length === 0) {
    input.type = "password";
    icon.src = "../assets/img/icons/form/lock.svg";
    icon.style.pointerEvents = "none";
    return;
  }
  if (input.type === "password") {
    input.type = "text";
    icon.src = "../assets/img/icons/form/visibility.svg";
  } else {
    input.type = "password";
    icon.src = "../assets/img/icons/form/visibility_off.svg";
  }
}
