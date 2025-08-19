function registerUser(event) {
    event.preventDefault(); // verhindert sofortiges Reload/Submit

    if (!validateForm()) {
        return false;
    } // Sicherheitsnetz

    let overlay = document.getElementById('signup_overlay');
    let msg = document.getElementById('overlay_message');

    // Overlay sichtbar machen
    overlay.classList.add('active');

    // Message einfahren
    msg.classList.add('enter');

    // Nach 2.7s ausblenden und weiterleiten
    setTimeout(function () {
      overlay.classList.add('leaving');
      setTimeout(function () {
        window.location.href = 'login.html';
      }, 300);
    }, 2700);
}

  // beim Laden einmal prüfen (Autofill-Fälle) --> Button-Deaktivierung zu Beginn, da alle Felder leer sind
(function init() {
  validateForm();
})();

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

   let nameVal  = nameInput.value.trim();
   let emailVal = emailInput.value.trim();
   let passVal  = passInput.value;
   let confVal  = confInput.value;
   let checked  = checkbox.checked;

   let notEmpty  = (nameVal !== '' && emailVal !== '' && passVal !== '' && confVal !== '');
   let emailOk   = isEmailValid(emailVal);
   let passMatch = (passVal !== '' && passVal === confVal);

   let allOk = notEmpty && emailOk && passMatch && checked;

   button.disabled = !allOk;   // Button aktivieren/deaktivieren
   return allOk;               // nützlich, um beim Submit nochmal zu prüfen
}