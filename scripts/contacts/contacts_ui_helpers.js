// MF - contacts_ui_helpers.js

/**
 * Contacts UI Helpers Module
 * DOM manipulation and UI update functions
 */

import { generateInitials } from './contacts_validation.js';

/**
 * Updates visual validation state of form input fields
 * @param {HTMLElement} inputElement - The input element to style
 * @param {Object} validationResult - Validation result object with isValid and message
 */
export function updateFieldValidation(inputElement, validationResult) {
    if (!inputElement) return;
    
    const errorElement = inputElement.parentElement.querySelector('.input_error');
    
    if (validationResult.isValid) {
        setValidState(inputElement, errorElement);
    } else if (inputElement.value.length > 0) {
        setErrorState(inputElement, errorElement, validationResult.message);
    } else {
        setDefaultState(inputElement, errorElement);
    }
}

function setValidState(inputElement, errorElement) {
    inputElement.style.borderColor = 'var(--c-active)';
    inputElement.title = '';
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

function setErrorState(inputElement, errorElement, message) {
    
    inputElement.style.borderColor = 'var(--c-warn)';
    inputElement.title = message;
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    } 
}

function setDefaultState(inputElement, errorElement) {
    inputElement.style.borderColor = 'var(--c-default)';
    inputElement.title = '';
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

/**
 * Updates avatar preview with initials or default icon
 * @param {string} name - Full name to generate initials from
 */
export function updateAvatarPreview(name) {
    const avatarInitials = document.getElementById('avatar_initials');
    if (!avatarInitials) return;
    
    const initials = generateInitials(name);
    if (initials.length > 0) {
        avatarInitials.textContent = initials;
    } else {
        avatarInitials.innerHTML = '<img src="../../assets/img/icons/form/person.svg" class="input_field_icon" alt="Person Icon" />';
    }
}

/**
 * Updates save button state based on form validation
 * @param {boolean} isFormValid - Whether the entire form is valid
 */
export function updateSaveButtonState(isFormValid) {
    const saveButton = document.getElementById('save_button');
    if (!saveButton) return;
    
    saveButton.disabled = !isFormValid;
    
    if (isFormValid) {
        saveButton.classList.remove('disabled');
    } else {
        saveButton.classList.add('disabled');
    }
}




export function displayContactSuccess(contactData) {
    if (!contactData) return;
    
    updateContactDisplayElements(contactData);
    updateContactAvatar(contactData);
    setupContactButtons(contactData);
}

function updateContactDisplayElements(contactData) {
    const contentHeadName = document.getElementById('content_head_name');
    const contactEmailDisplay = document.getElementById('contact_email');
    const contactPhoneDisplay = document.getElementById('contact_phone');
    
    if (contentHeadName) contentHeadName.textContent = contactData.name;
    if (contactEmailDisplay) contactEmailDisplay.textContent = contactData.email;
    if (contactPhoneDisplay) contactPhoneDisplay.textContent = contactData.phone;
}

function updateContactAvatar(contactData) {
    const contactAvatar = document.getElementById('contact_avatar');
    const avatarInitials = document.getElementById('avatar_initials');
    
    if (contactData.avatarColor && contactAvatar) {
        contactAvatar.style.backgroundColor = contactData.avatarColor;
    }
    
    if (avatarInitials) {
        const initials = generateInitials(contactData.name);
        avatarInitials.textContent = initials;
    }
}

function setupContactButtons(contactData) {
    if (!contactData.id) return;
    
    const editButton = document.getElementById('edit_contact_btn');
    if (editButton) {
        editButton.onclick = () => window.editContact(contactData.id);
    }
    
    const deleteButton = document.getElementById('delete_contact_btn');
    if (deleteButton) {
        deleteButton.onclick = () => window.deleteContactFromSuccessPage(contactData.id);
    }
}


/**
 * Displays contact data in form input fields for editing
 * @param {Object} contactData - Contact object with name, email, phone, avatarColor
 */
export function displayContactDataInForm(contactData) {
    const nameInput = document.getElementById('name_input');
    const emailInput = document.getElementById('email_input');
    const phoneInput = document.getElementById('telephone_input');
    const contactAvatar = document.getElementById('contact_avatar');
    
    if (nameInput) nameInput.value = contactData.name || '';
    if (emailInput) emailInput.value = contactData.email || '';
    if (phoneInput) phoneInput.value = contactData.phone || '';
    
    if (contactData.avatarColor && contactAvatar) {
        contactAvatar.style.backgroundColor = contactData.avatarColor;
    }
    
    updateAvatarPreview(contactData.name);
}

/**
 * Clears all form inputs and resets styling
 */
export function clearFormInputs() {    
    const nameInput = document.getElementById('name_input');
    const emailInput = document.getElementById('email_input');
    const phoneInput = document.getElementById('telephone_input');
    const avatarInitials = document.getElementById('avatar_initials');    
    
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (phoneInput) phoneInput.value = '';
    
    if (nameInput) {
        nameInput.style.borderColor = 'var(--c-default)';
        nameInput.title = '';
    }
    if (emailInput) {
        emailInput.style.borderColor = 'var(--c-default)';
        emailInput.title = '';
    }
    if (phoneInput) {
        phoneInput.style.borderColor = 'var(--c-default)';
        phoneInput.title = '';
    }    
    if (avatarInitials) {
        avatarInitials.innerHTML = '<img src="../../assets/img/icons/form/person.svg" class="input_field_icon" alt="Person Icon" />';
    }
}

/**
 * Updates button text and disabled state during operations
 * @param {string} text - Text to display on button
 * @param {boolean} disabled - Whether button should be disabled
 */
export function updateButtonState(text, disabled = false) {
    const saveButton = document.getElementById('save_button');
    const buttonText = document.getElementById('button_text');
    
    if (saveButton) {
        saveButton.disabled = disabled;
    }
    
    if (buttonText) {
        buttonText.textContent = text;
    }
}


/**
 * Shows a toast notification message
 * @param {string} message - The message text to display
 * @param {string} type - Message type for styling ('success', 'error', 'warning', 'info')
 * @param {number} duration - Duration in milliseconds before auto-hide (default: 3000)
 * @returns {HTMLElement} The created toast element
 */

export function showOverlayMessage(message, type = 'success', duration = 3000) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    
    const messageBox = document.createElement('div');
    messageBox.className = 'overlay_message';
    messageBox.textContent = message;
    
    overlay.appendChild(messageBox);
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.classList.add('active');
        messageBox.classList.add('enter');
    }, 10);
    
    setTimeout(() => {
        overlay.classList.add('leaving');
        setTimeout(() => overlay.remove(), 300);
    }, duration);
}