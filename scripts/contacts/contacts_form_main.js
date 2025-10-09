// MF - contacts_form_main.js
/**
 * Contact Form - Main Entry Point
 * Initializes form validation and coordinates save/delete operations
 */

import { 
    PAGES, 
    STORAGE_KEYS
} from '../config.js';

import { getFormData } from './contacts_validation.js';

import { 
    updateFieldValidation, 
    updateAvatarPreview, 
    updateSaveButtonState
} from './contacts_ui_helpers.js';

import { saveContact } from './contacts_save.js';
import { deleteContact } from './contacts_delete.js';
import { 
    loadContactDataForSuccessPage,
    loadContactDataForEditPage 
} from './contacts_navigation.js';

// ================== DOM ELEMENT CONSTANTS ==================
// const NAME_INPUT = document.getElementById('name_input');
// const EMAIL_INPUT = document.getElementById('email_input');
// const PHONE_INPUT = document.getElementById('telephone_input');

// ================== FORM VALIDATION ==================

/**
 * Orchestrates complete form validation and UI updates
 * @returns {Object} Complete form validation results
 */
function validateContactForm() {
    const NAME_INPUT  = document.getElementById('name_input');
    const EMAIL_INPUT = document.getElementById('email_input');
    const PHONE_INPUT = document.getElementById('telephone_input');

    const formData = getFormData();
    
    updateFieldValidation(NAME_INPUT, formData.nameValidation);
    updateFieldValidation(EMAIL_INPUT, formData.emailValidation);
    updateFieldValidation(PHONE_INPUT, formData.phoneValidation);
    
    updateAvatarPreview(formData.name);
    updateSaveButtonState(formData.isValid);
    
    return formData;
}

// ================== EVENT LISTENERS ==================

/**
 * Initializes form input event listeners
 */
// function initializeEventListeners() {
//     if (NAME_INPUT) NAME_INPUT.addEventListener('input', validateContactForm);
//     if (EMAIL_INPUT) EMAIL_INPUT.addEventListener('input', validateContactForm);
//     if (PHONE_INPUT) PHONE_INPUT.addEventListener('input', validateContactForm);
// }

function initializeEventListeners() {
  // Einmal global setzen – reagiert auf dynamisch eingefügte Inputs
  document.addEventListener('input', (e) => {
    const id = e.target?.id;
    if (id === 'name_input' || id === 'email_input' || id === 'telephone_input') {
      validateContactForm();
    }
  });
}

// ================== NAVIGATION ==================

function closeEditContact() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_EDIT_ID);
    window.location.href = PAGES.MAIN_PAGE;
}

// ================== INITIALIZATION ==================

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('contacts_add_successful.html')) {
        loadContactDataForSuccessPage();
    } 
    else if (window.location.pathname.includes('contacts_edit.html')) {
        initializeEventListeners();
        loadContactDataForEditPage();
    }
    else {
        initializeEventListeners();

        if (document.getElementById('name_input') ||
            document.getElementById('email_input') ||
            document.getElementById('telephone_input')) {
            validateContactForm();
        }
        
        // if (NAME_INPUT || EMAIL_INPUT || PHONE_INPUT) {
        //     validateContactForm();
        // }
    }
});

// ================== GLOBAL EXPORTS ==================
window.validateContactForm = validateContactForm;
window.closeEditContact = closeEditContact;
window.saveContact = saveContact;
window.deleteContact = deleteContact;