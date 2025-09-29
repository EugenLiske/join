// MF

/**
 * Contact Management - Main Orchestration
 * Coordinates validation, UI updates, Firebase operations and navigation
 */

// ================== IMPORTS ==================
import { 
    PAGES, 
    STORAGE_KEYS
} from '../config.js';

import { 
    getFormData, 
    generateInitials 
} from './contacts_validation.js';

import { 
    updateFieldValidation, 
    updateAvatarPreview, 
    updateSaveButtonState,
    displayContactSuccess,
    displayContactDataInForm,
    clearFormInputs,
    updateButtonState,
    showOverlayMessage
} from './contacts_ui_helpers.js';

import { 
    checkEmailExists,
    checkEmailExistsForEdit,
    saveContactToFirebase,
    saveEditContactToFirebase,
    deleteContactFromFirebase,
    loadExistingContact
} from './contacts_firebase_api.js';

// ================== DOM ELEMENT CONSTANTS ==================
const NAME_INPUT = document.getElementById('name_input');
const EMAIL_INPUT = document.getElementById('email_input');
const PHONE_INPUT = document.getElementById('telephone_input');
const SAVE_BUTTON = document.getElementById('save_button');
const BUTTON_TEXT = document.getElementById('button_text');
const CONTACT_AVATAR = document.getElementById('contact_avatar');
const AVATAR_INITIALS = document.getElementById('avatar_initials');

const CONTENT_HEAD_NAME = document.getElementById('content_head_name');
const CONTACT_EMAIL_DISPLAY = document.getElementById('contact_email');
const CONTACT_PHONE_DISPLAY = document.getElementById('contact_phone');

// ================== ORCHESTRATION FUNCTIONS ==================

/**
 * Orchestrates complete form validation and UI updates
 * @returns {Object} Complete form validation results
 */
function validateContactForm() {
    const formData = getFormData();
    
    updateFieldValidation(NAME_INPUT, formData.nameValidation);
    updateFieldValidation(EMAIL_INPUT, formData.emailValidation);
    updateFieldValidation(PHONE_INPUT, formData.phoneValidation);
    
    updateAvatarPreview(formData.name);
    updateSaveButtonState(formData.isValid);
    
    return formData;
}

// ================== NAVIGATION FUNCTIONS ==================

/**
 * Navigates to success page with contact data
 * @param {Object} contactData - Contact data to display on success page
 */
function navigateToSuccessPage(contactData) {
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED_CONTACT, JSON.stringify(contactData));
    //window.location.href = PAGES.SUCCESS_PAGE;
}

/**
 * Navigates to edit page with contact ID
 * @param {number} contactId - ID of contact to edit
 */
function editContact(contactId) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_EDIT_ID, contactId);
    window.location.href = PAGES.EDIT_CONTACT;
}

/**
 * Closes edit/add overlay and returns to previous page
 */
function closeEditContact() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_EDIT_ID);
    window.location.href = PAGES.MAIN_PAGE;
}

// ================== SUCCESS PAGE FUNCTIONS ==================

/**
 * Loads and displays contact data for success page
 */
function loadContactDataForSuccessPage() {
    const contactDataJSON = localStorage.getItem(STORAGE_KEYS.LAST_SAVED_CONTACT);
    
    if (contactDataJSON) {
        try {
            const contactData = JSON.parse(contactDataJSON);
            displayContactSuccess(contactData);
            setupClickOutsideToClose();
            
            // Toast nach 0,5 Sekunden anzeigen
            setTimeout(() => {
                showOverlayMessage('Contact successfully created!', 'success', 3000);
            }, 500);
            
        } catch (error) {
            console.error('Error parsing contact data:', error);
        }
    } else {
        console.error('No contact data found for success page');
    }
}


/**
 * Sets up click-outside for success page overlay
 */
function setupClickOutsideToClose() {
    document.addEventListener('click', function(event) {
        const overlayContent = document.querySelector('.content');
        
        if (overlayContent && !overlayContent.contains(event.target)) {
            localStorage.removeItem(STORAGE_KEYS.LAST_SAVED_CONTACT);
            window.history.back();
        }
    });
}


// ================== EDIT FUNCTIONALITY ==================


/**
 * Handles errors when contact loading fails
 * @param {Error} error - The error that occurred
 */
function handleContactLoadError(error) {
    showOverlayMessage('Error loading contact data. Contact may have been deleted.', 'error', 2500);
    setTimeout(() => {
        window.history.back();
    }, 3000);
}

/**
 * Loads contact data for editing and populates form
 * @param {number} contactId - ID of contact to load for editing
 * @returns {Promise<Object|null>} Contact data or null if error
 */
async function loadContactForEdit(contactId) {
    try {
        const contactData = await loadExistingContact(contactId);
        if (!contactData) {
            throw new Error('Contact not found');
        }
        
        displayContactDataInForm(contactData);
        validateContactForm();
        return contactData;
        
    } catch (error) {
        handleContactLoadError(error);
        return null;
    }
}

/**
 * Auto-loads contact data when edit page loads
 */
function loadContactDataForEditPage() {
    const contactId = localStorage.getItem(STORAGE_KEYS.CURRENT_EDIT_ID);
    
    if (contactId) {
        loadContactForEdit(parseInt(contactId));
    } else {
        showOverlayMessage('No contact ID found for edit page', 'error', 2500);
        setTimeout(() => {
            window.history.back();
        }, 3000);
    }
}

// ================== DELETE FUNCTIONALITY ==================

/**
 * Deletes contact from success page and navigates to add contact
 * @param {number} contactId - ID of contact to delete
 */
async function deleteContactFromSuccessPage(contactId) {
    try {        
        await deleteContactFromFirebase(parseInt(contactId));
        
        // Success-Toast anzeigen
        showOverlayMessage('Contact deleted successfully', 'success', 1800);
        
        // Navigation nach 1.8 Sekunden
        setTimeout(() => {
            localStorage.removeItem(STORAGE_KEYS.LAST_SAVED_CONTACT);
            window.location.href = PAGES.ADD_CONTACT;
        }, 2000);
        
    } catch (error) {
        console.error('Error deleting contact:', error);
        // Error-Toast ohne Auto-Navigation
        showOverlayMessage('Error deleting contact. Please try again.', 'error', 3000);
    }
}
/**
 * Deletes contact from edit page and navigates back
 */
async function deleteContact() {
    const contactId = localStorage.getItem(STORAGE_KEYS.CURRENT_EDIT_ID);
    
    if (!contactId) {
        console.error('No contact ID found for deletion');
        return;
    }
    
    try {
        // Kurzer Info-Toast während Löschvorgang
        showOverlayMessage('Deleting contact...', 'warning', 1000);
        
        await deleteContactFromFirebase(parseInt(contactId));
        
        // Success-Toast anzeigen
        showOverlayMessage('Contact deleted successfully', 'success', 1500);
        
        // Navigation nach 1.8 Sekunden
        setTimeout(() => {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_EDIT_ID);        
            window.history.back();
        }, 1800);
        
    } catch (error) {
        // Error-Toast ohne Auto-Navigation (Benutzer soll Fehler sehen)
        showOverlayMessage('Error deleting contact. Please try again.', 'error', 3000);
    }
}

// ================== MAIN SAVE FUNCTION ==================

/**
 * Main save function - handles both CREATE and UPDATE operations
 * @param {Event} event - Form submit event
 */
/**
 * Handles CREATE mode - saves new contact
 * @param {Object} formData - Validated form data
 * @returns {Promise<boolean>} Success status
 */
async function handleCreateMode(formData) {
    const emailExists = await checkEmailExists(formData.email);
    if (emailExists) {
        showOverlayMessage('This email address is already in use. Please use a different email.', 'error', 3000);
        return false;
    }
    
    const savedContact = await saveContactToFirebase(formData.contactData);
    
    // Success-Toast anzeigen
    showOverlayMessage('Contact saved successfully', 'success', 1500);
    
    clearFormInputs();
    
    // Navigation zur Success-Page nach 1.8 Sekunden
    setTimeout(() => {
        navigateToSuccessPage(savedContact);
    }, 1800);
    
    return true;
}

/**
 * Handles EDIT mode - updates existing contact
 * @param {Object} formData - Validated form data
 * @param {string} contactId - ID of contact being edited
 * @returns {Promise<boolean>} Success status
 */
async function handleEditMode(formData, contactId) {    
    if (!contactId) {
        throw new Error('No contact ID found for editing');
    }
    
    const existingContact = await loadExistingContact(parseInt(contactId));
    
    if (!existingContact) {
        throw new Error('Could not load existing contact');
    }
    
    const formEmailLower = formData.email.toLowerCase();
    const existingEmailLower = existingContact.email.toLowerCase();
    
    if (formEmailLower !== existingEmailLower) {
        const emailExists = await checkEmailExistsForEdit(formData.email, parseInt(contactId));
        
        if (emailExists) {
            showOverlayMessage('This email address is already in use.', 'error', 3000);
            return false;
        }
    } 
    
    const updatedContact = await saveEditContactToFirebase(parseInt(contactId), formData.contactData);
    
    showOverlayMessage('Contact updated successfully', 'success', 1500);
    
    return true;
}


/**
 * Main save function - coordinates CREATE/EDIT operations
 * @param {Event} event - Form submit event
 */
async function saveContact(event) {    
    if (event) event.preventDefault();
    
    const formData = getFormData();
    
    if (!formData.isValid) {
        showOverlayMessage('Please correct the form errors before saving.');
        return false;
    }
    
    const contactId = localStorage.getItem(STORAGE_KEYS.CURRENT_EDIT_ID);
    
    // ✅ GEÄNDERT: Prüfe ob contactId existiert statt URL-Check
    const isEditMode = contactId !== null;    
    try {
        const success = isEditMode 
            ? await handleEditMode(formData, contactId)
            : await handleCreateMode(formData);        
        return success;
        
    } catch (error) {
        showOverlayMessage('Error saving contact. Please check your connection and try again.');
        return false;
    }
}


// ================== EVENT LISTENERS ==================

/**
 * Initializes form input event listeners
 */
function initializeEventListeners() {
    if (NAME_INPUT) NAME_INPUT.addEventListener('input', validateContactForm);
    if (EMAIL_INPUT) EMAIL_INPUT.addEventListener('input', validateContactForm);
    if (PHONE_INPUT) PHONE_INPUT.addEventListener('input', validateContactForm);
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
        
        if (NAME_INPUT || EMAIL_INPUT || PHONE_INPUT) {
            validateContactForm();
        }
    }
});

// ================== GLOBAL EXPORTS ==================
window.validateContactForm = validateContactForm;
window.closeEditContact = closeEditContact;
window.saveContact = saveContact;
window.clearFormInputs = clearFormInputs;
window.editContact = editContact;
window.deleteContact = deleteContact;
window.deleteContactFromSuccessPage = deleteContactFromSuccessPage;