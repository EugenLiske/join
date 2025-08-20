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