// References to DOM elements and other variables

/** @type {HTMLInputElement} Reference to the name input field */
const nameInput                   = document.getElementById("name_input");
/** @type {HTMLInputElement} Reference to the email input field */
const emailInput                  = document.getElementById("email_input");
/** @type {HTMLInputElement} Reference to the password input field */
const passwordInput               = document.getElementById("password_input");
/** @type {HTMLInputElement} Reference to the confirmation password input field */
const confirmationPasswordInput   = document.getElementById("confirm_input");
/** @type {HTMLInputElement} Reference to the privacy policy checkbox */
const checkbox                    = document.getElementById("privacy_checkbox");
/** @type {HTMLButtonElement} Reference to the sign-up button */
const signupButton                = document.getElementById("signup_button");
/** @type {HTMLDivElement} Container for password/confirmation related error messages */
const confirmationError           = document.getElementById("confirm_error");
/** @type {HTMLDivElement} Container for email validation related error messages */
const emailError                  = document.getElementById("email_error");
/** @type {HTMLDivElement} Fullscreen overlay shown on successful signup */
const signupOverlay               = document.getElementById("signup_overlay");
/** @type {HTMLDivElement} Message element inside the success overlay */
const overlayMessage              = document.getElementById("overlay_message");
/** @const {string} Copy shown when a user with the given email already exists */
const USER_EXISTS_MSG             = "This user exists already. Please use a different email address.";
/** @const {string} Copy shown when the email address is syntactically invalid */
const EMAIL_INVALID_MSG           = "Please enter a valid email address.";
/** @const {number} Minimal required length for passwords */
const PASSWORD_MIN_LENGTH         = 8;
/** @const {string} Base endpoint URL for the Firebase Realtime Database */
const BASE_URL                    = "https://join-test-c19be-default-rtdb.firebaseio.com";

/**
 * Initializes UI on potential autofill and first render.
 * Ensures validation state, password icon visibility, and button state are correct.
 * @returns {void}
 */
function initAutoFill() {
  validateForm();
  handlePasswordInput("password_input", "password_icon");
  handlePasswordInput("confirm_input", "confirm_icon");
}
initAutoFill();

/**
 * Fetches all users (or a subtree) from the Firebase database.
 * @async
 * @param {string} path - Database path starting with a slash (e.g., "/users").
 * @returns {Promise<Object|null>} Resolves with the JSON object found at the path, or null if empty.
 * @throws {Error} If the network request fails or returns a non-OK status.
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

/**
 * Writes (PUT) data to a specific path in the Firebase database.
 * Replaces the content of the target node with the given data.
 * @async
 * @param {string} path - Database path starting with a slash (e.g., "/users/user_5").
 * @param {any} data - Serializable data (object/primitive) to store at the path.
 * @returns {Promise<void>} Resolves when the write has completed successfully.
 * @throws {Error} If the network request fails or returns a non-OK status.
 */
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

/**
 * Handles the sign-up form submission.
 * Validates the form, checks for existing users by email, creates the new user, and shows success overlay.
 * @async
 * @param {SubmitEvent} event - The form submit event.
 * @returns {Promise<boolean>} False when prevented (invalid or handled), otherwise resolves after completion.
 */
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

/**
 * Checks whether the submitted email already exists within the provided user dataset.
 * Also updates the UI with an appropriate error if a duplicate is found.
 * @param {Object<string, {email?: string}> | null} userResponse - Object keyed by user IDs, each containing user data.
 * @returns {boolean} True if a user with the same email already exists; otherwise false.
 */
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

/**
 * Iterates over all users and compares stored emails to the given one.
 * @param {Object<string, {email?: string}>} userResponse - Object keyed by user IDs with user data.
 * @param {string} emailToCheck - Lowercased, trimmed email to look for.
 * @returns {boolean} True if a matching email is found; otherwise false.
 */
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

/**
 * Determines the next numeric user ID by scanning existing keys of the form "user_{n}".
 * @param {Object<string, any> | null} userResponse - Object keyed by user IDs; null if no users yet.
 * @returns {number} The next numeric ID to assign (starting at 1).
 */
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

/**
 * Assembles a user object from current form values and uploads it to the database.
 * @async
 * @param {number} nextUserID - Numeric part of the new user key (e.g., 6 for "user_6").
 * @returns {Promise<void>} Resolves after the user has been stored.
 */
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

/**
 * Derives a two-letter uppercase initial string from a given name.
 * First letter of first name and first letter of last name (if present).
 * @param {string} rawName - Full name as entered by the user.
 * @returns {string} Uppercased initials (e.g., "JD" or "J" if only one name part).
 */
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

/**
 * Shows a success overlay and redirects to the index page after a short delay.
 * Includes exit animation before navigation.
 * @returns {void}
 */
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

/**
 * Validates the whole form and toggles the sign-up button accordingly.
 * Also triggers rendering of password/email related error messages.
 * @returns {boolean} True if all validation requirements are met; otherwise false.
 */
function validateForm() {
  const formInput = readFormInput();
  const evaluatedFormInput = evaluateFormInput(formInput);
  renderPasswordErrors(evaluatedFormInput);
  setSignupButtonState(evaluatedFormInput.allValid);
  return evaluatedFormInput.allValid;
}

/**
 * Reads and normalizes the current values from the form controls.
 * @returns {{name: string, email: string, password: string, confirmPassword: string, privacyChecked: boolean}}
 *   A snapshot of the form state.
 */
function readFormInput() {
  return {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value,
    confirmPassword: confirmationPasswordInput.value,
    privacyChecked: checkbox.checked,
  };
}

/**
 * Evaluates basic business validation rules on the given form snapshot.
 * @param {{name: string, email: string, password: string, confirmPassword: string, privacyChecked: boolean}} formInput - Current form values.
 * @returns {{
 *   allFieldsFilled: boolean,
 *   emailFormatValid: boolean,
 *   passwordsMatch: boolean,
 *   passwordLongEnough: boolean,
 *   showMismatchError: boolean,
 *   showTooShortError: boolean,
 *   allValid: boolean
 * }} Summary of validation flags and the combined validity.
 */
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

/**
 * Renders/clears error messages related to password mismatch and length.
 * Also clears any email error display to avoid overlapping messages.
 * @param {{
 *   showMismatchError: boolean,
 *   showTooShortError: boolean
 * }} evaluatedFormInput - Validation flags from {@link evaluateFormInput}.
 * @returns {void}
 */
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

/**
 * Enables/disables the sign-up button depending on validity.
 * @param {boolean} isFormValid - True to enable, false to disable.
 * @returns {void}
 */
function setSignupButtonState(isFormValid) {
  signupButton.disabled = !isFormValid;
}

/**
 * Checks if an email string is syntactically valid using a simple regex.
 * @param {string} email - Email string to validate.
 * @returns {boolean} True if the email matches the pattern; otherwise false.
 */
function isEmailValid(email) {
  let regularExpression = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  return regularExpression.test(email);
}

// Fixing the error message when re-entering (i.e., onfocus/oninput).
// In case an email address that has already been used was entered in registerUser.
// And if no valid email address was entered.

/**
 * Clears email-related error decorations and messages.
 * Useful when the user re-enters the field to correct their input.
 * @returns {void}
 */
function clearEmailError() {
  emailInput.classList.remove("error");
  emailError.textContent = "";
  emailError.style.display = "none";
}

/**
 * Validates the email field when it loses focus and shows an inline error if invalid.
 * Also ensures no duplicate password error messages are shown at the same time.
 * @returns {void}
 */
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

/**
 * Updates password input visibility icon and interactivity while typing.
 * Shows a lock icon when empty; toggles between "visibility" and "visibility_off" based on current input type.
 * @param {string} inputId - DOM id of the related password input element.
 * @param {string} iconId - DOM id of the icon element to update.
 * @returns {void}
 */
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

/**
 * Toggles the visibility of the password text for a given input and updates the icon accordingly.
 * If the input is empty, resets to a locked state and disables icon interaction.
 * @param {string} inputId - DOM id of the password/confirmation input element.
 * @param {string} iconId - DOM id of the clickable icon element.
 * @returns {void}
 */
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
