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
    
    inputElement.style.borderColor = '';
    
    if (validationResult.isValid) {
        inputElement.style.borderColor = 'var(--c-active)';
        inputElement.title = '';
    } else if (inputElement.value.length > 0) {
        inputElement.style.borderColor = 'var(--c-warn)';
        inputElement.title = validationResult.message;
    } else {
        inputElement.style.borderColor = 'var(--c-default)';
        inputElement.title = '';
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
        avatarInitials.innerHTML = '<img src="../assets/img/icons/form/person.svg" class="input_field_icon" alt="Person Icon" />';
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
    if (!contactData) {
        console.error('No contact data to display');
        return;
    }
    
    console.log('Displaying success page for:', contactData);
    
    const contentHeadName = document.getElementById('content_head_name');
    const contactEmailDisplay = document.getElementById('contact_email');
    const contactPhoneDisplay = document.getElementById('contact_phone');
    const contactAvatar = document.getElementById('contact_avatar');
    const avatarInitials = document.getElementById('avatar_initials');
    
    if (contentHeadName) {
        contentHeadName.textContent = contactData.name;
    }
    
    if (contactEmailDisplay) {
        contactEmailDisplay.textContent = contactData.email;
    }
    
    if (contactPhoneDisplay) {
        contactPhoneDisplay.textContent = contactData.phone;
    }
    
    if (contactData.avatarColor && contactAvatar) {
        contactAvatar.style.backgroundColor = contactData.avatarColor;
    }
    
    if (avatarInitials) {
        const initials = generateInitials(contactData.name);
        avatarInitials.textContent = initials;
    }
    
    // NEU: Event-Listener für Edit und Delete-Buttons
    const editButton = document.getElementById('edit_contact_btn');
    if (editButton && contactData.id) {
        editButton.onclick = () => window.editContact(contactData.id);
        editButton.style.cursor = 'pointer';
    }
    
    const deleteButton = document.getElementById('delete_contact_btn');
    if (deleteButton && contactData.id) {
        deleteButton.onclick = () => window.deleteContactFromSuccessPage(contactData.id);
        deleteButton.style.cursor = 'pointer';
    }
    
    console.log('Success page updated successfully');
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
    
    // Update avatar background color
    if (contactData.avatarColor && contactAvatar) {
        contactAvatar.style.backgroundColor = contactData.avatarColor;
    }
    
    updateAvatarPreview(contactData.name);
    console.log('Form populated with contact data');
}

/**
 * Clears all form inputs and resets styling
 */
export function clearFormInputs() {
    console.log('Clearing form inputs after successful save');
    
    const nameInput = document.getElementById('name_input');
    const emailInput = document.getElementById('email_input');
    const phoneInput = document.getElementById('telephone_input');
    const avatarInitials = document.getElementById('avatar_initials');
    
    // Clear input values
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (phoneInput) phoneInput.value = '';
    
    // Reset field styling
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
    
    // Reset avatar to default
    if (avatarInitials) {
        avatarInitials.innerHTML = '<img src="../assets/img/icons/form/person.svg" class="input_field_icon" alt="Person Icon" />';
    }
    
    console.log('Form inputs cleared successfully');
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