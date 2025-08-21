
      // FORM VALIDATION FUNCTION
      function validateContactForm() {
        const nameInput = document.getElementById("name_input");
        const emailInput = document.getElementById("email_input");
        const phoneInput = document.getElementById("telephone_input");
        const saveButton = document.getElementById("save_button");

        const nameVal = nameInput.value.trim();
        const emailVal = emailInput.value.trim();
        const phoneVal = phoneInput.value.trim();

        const isValid =
          nameVal !== "" &&
          emailVal !== "" &&
          phoneVal !== "" &&
          isEmailValid(emailVal);

        saveButton.disabled = !isValid;
        updateContactAvatar();
        return isValid;
      }

      // EMAIL VALIDATION
      function isEmailValid(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
        return regex.test(email);
      }

      // UPDATE AVATAR INITIALS
      function updateContactAvatar() {
        const nameInput = document.getElementById("name_input");
        const avatarInitials = document.getElementById("avatar_initials");

        const name = nameInput.value.trim();

        if (name) {
          const nameParts = name.split(" ");
          let initials = "";

          if (nameParts.length >= 2) {
            initials = nameParts[0][0] + nameParts[1][0];
          } else if (nameParts.length === 1) {
            initials = nameParts[0][0] + (nameParts[0][1] || "");
          }

          avatarInitials.textContent = initials.toUpperCase();
        } else {
          avatarInitials.textContent = "??";
        }
      }

      // SAVE CONTACT FUNCTION
      function saveContact(event) {
        event.preventDefault();

        if (!validateContactForm()) {
          return false;
        }

        const saveButton = document.getElementById("save_button");
        const buttonText = document.getElementById("button_text");
        const buttonCheckmark = document.getElementById("button_checkmark");

        // DISABLE BUTTON AND SHOW LOADING
        saveButton.disabled = true;
        buttonText.textContent = "Saving...";

        // SIMULATE SAVE PROCESS
        const contactData = {
          name: document.getElementById("name_input").value.trim(),
          email: document.getElementById("email_input").value.trim(),
          phone: document.getElementById("telephone_input").value.trim(),
        };

        console.log("Saving contact:", contactData);

        // SHOW SUCCESS STATE AFTER DELAY
        setTimeout(() => {
          buttonText.style.display = "none";
          buttonCheckmark.style.display = "inline";
          saveButton.classList.add("success");

          // REDIRECT AFTER SUCCESS
          setTimeout(() => {
            alert("Contact saved successfully!");
            closeEditContact();
          }, 2000);
        }, 1500);

        return false;
      }

      // DELETE CONTACT FUNCTION
      function deleteContact() {
        if (
          confirm(
            "Are you sure you want to delete this contact? This action cannot be undone."
          )
        ) {
          console.log("Deleting contact...");
          // ADD DELETE LOGIC HERE
          alert("Contact deleted successfully!");
          closeEditContact();
        }
      }

      // CLOSE EDIT CONTACT FUNCTION
      function closeEditContact() {
        // OPTION 1: GO BACK TO PREVIOUS PAGE
        window.history.back();

        // OPTION 2: REDIRECT TO CONTACTS PAGE
        // window.location.href = 'contacts.html';

        // OPTION 3: CLOSE MODAL IF THIS IS A MODAL
        // document.querySelector('.edit_main').style.display = 'none';
      }

      // SET CONTACT COLOR FROM DATABASE
      function setContactColor(colorFromDatabase) {
        const contactAvatar = document.getElementById("contact_avatar");

        if (colorFromDatabase) {
          contactAvatar.style.backgroundColor = colorFromDatabase;
        } else {
          contactAvatar.style.backgroundColor = "";
        }
      }

      // INITIALIZE ON PAGE LOAD
      document.addEventListener("DOMContentLoaded", function () {
        validateContactForm();

        // EXAMPLE: LOAD CONTACT DATA
        // loadContactData();
      });

      // EXAMPLE FUNCTION TO LOAD CONTACT DATA
      function loadContactData() {
        // SIMULATE LOADING CONTACT FROM DATABASE
        const contactData = {
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+1 234 567 8900",
          avatarColor: "var(--c-pf-var3)",
        };

        // FILL FORM WITH DATA
        document.getElementById("name_input").value = contactData.name;
        document.getElementById("email_input").value = contactData.email;
        document.getElementById("telephone_input").value = contactData.phone;

        // SET AVATAR COLOR AND INITIALS
        setContactColor(contactData.avatarColor);
        updateContactAvatar();
        validateContactForm();
      }
    