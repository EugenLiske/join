function checkLoginEnable() {
    let nameVal = document.getElementById('name_input').value.trim();
    let passVal = document.getElementById('password_input').value; // kein trim bei Passwörtern
    let btn     = document.getElementById('login_button');

    // Button aktiv, sobald beide Felder nicht leer sind:
    let anyFilled = (nameVal !== '' && passVal !== '');
    btn.disabled = !anyFilled;
    return anyFilled;
}

// beim Laden: Autofill berücksichtigen
(function initLoginBtn() {
    checkLoginEnable();
})();

// ✅ NEU: Login-spezifische Version
function handleLoginPwdInput(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon  = document.getElementById(iconId);

  if (!input || !icon) return;

  if (input.value.length === 0) {
    input.type = 'password';
    icon.src   = './assets/img/icons/form/lock.svg';
    icon.style.pointerEvents = 'none';
    return;
  }

  icon.style.pointerEvents = 'auto';

  if (input.type === 'text') {
    icon.src = './assets/img/icons/form/visibility.svg';
  } else {
    icon.src = './assets/img/icons/form/visibility_off.svg';
  }
}

// ✅ NEU: Login-spezifische Version
function toggleLoginVisibility(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon  = document.getElementById(iconId);

  if (!input || !icon) return false;

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

// ✅ NEU: eigener Init-Block fürs Login
(function initLoginPwdIcon() {
  handleLoginPwdInput('password_input','login_password_icon');
})();