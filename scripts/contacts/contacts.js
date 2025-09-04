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
    updateButtonState 
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
    console.log('Navigating to success page with data:', contactData);
    window.location.href = PAGES.SUCCESS_PAGE;
}

/**
 * Navigates to edit page with contact ID
 * @param {number} contactId - ID of contact to edit
 */
function editContact(contactId) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_EDIT_ID, contactId);
    console.log('Navigating to edit page for contact:', contactId);
    window.location.href = PAGES.EDIT_CONTACT;
}

/**
 * Closes edit/add overlay and returns to previous page
 */
function closeEditContact() {
    // Clean up edit data if present
    localStorage.removeItem(STORAGE_KEYS.CURRENT_EDIT_ID);
    window.history.back();
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
            
        } catch (error) {
            console.error('Error parsing contact data:', error);
        }
    } else {
        console.warn('No contact data found for success page');
    }
}

/**
 * Sets up click-outside for success page overlay
 */
function setupClickOutsideToClose() {
    document.addEventListener('click', function(event) {
        const overlayContent = document.querySelector('.content');
        
        if (overlayContent && !overlayContent.contains(event.target)) {
            console.log('Clicked outside overlay, closing...');
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
    console.error('Error loading contact for edit:', error);
    // TODO: Replace with Toast
    alert('Error loading contact data. Contact may have been deleted.');
    window.history.back();
}

/**
 * Loads contact data for editing and populates form
 * @param {number} contactId - ID of contact to load for editing
 * @returns {Promise<Object|null>} Contact data or null if error
 */
async function loadContactForEdit(contactId) {
    try {
        console.log('Loading contact for edit:', contactId);
        
        const contactData = await loadExistingContact(contactId);
        if (!contactData) {
            throw new Error('Contact not found');
        }
        
        displayContactDataInForm(contactData);
        validateContactForm();
        console.log('Contact data loaded for editing');
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
        console.warn('No contact ID found for edit page');
        alert('No contact selected for editing');
        window.history.back();
    }
}

// ================== DELETE FUNCTIONALITY ==================

/**
 * Deletes contact from success page and navigates to add contact
 * @param {number} contactId - ID of contact to delete
 */
async function deleteContactFromSuccessPage(contactId) {
    try {
        console.log('Deleting contact from success page:', contactId);
        
        await deleteContactFromFirebase(contactId);
        
        // Clear stored data
        localStorage.removeItem(STORAGE_KEYS.LAST_SAVED_CONTACT);
        
        // Navigate back to add contact page
        window.location.href = PAGES.ADD_CONTACT;
        
    } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Error deleting contact. Please try again.');
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
        console.log('Deleting contact from edit page:', contactId);
        
        await deleteContactFromFirebase(parseInt(contactId));
        
        // Clear stored data
        localStorage.removeItem(STORAGE_KEYS.CURRENT_EDIT_ID);
        
        // Navigate back
        window.history.back();
        
    } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Error deleting contact. Please try again.');
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
        // TODO: Replace with Toast
        alert('This email address is already in use. Please use a different email.');
        return false;
    }
    
    const savedContact = await saveContactToFirebase(formData.contactData);
    console.log('Contact saved successfully with ID:', savedContact.id);
    
    clearFormInputs();
    navigateToSuccessPage(savedContact);
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
    
    const emailExists = await checkEmailExistsForEdit(formData.email, parseInt(contactId));
    if (emailExists) {
        // TODO: Replace with Toast
        alert('This email address is already in use by another contact. Please use a different email.');
        return false;
    }
    
    const updatedContact = await saveEditContactToFirebase(parseInt(contactId), formData.contactData);
    console.log('Contact updated successfully with ID:', updatedContact.id);
    
    localStorage.removeItem(STORAGE_KEYS.CURRENT_EDIT_ID);
    window.history.back();
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
        // TODO: Replace with Toast
        alert('Please correct the form errors before saving.');
        return;
    }
    
    const isEditMode = window.location.pathname.includes('contacts_edit.html');
    const contactId = localStorage.getItem(STORAGE_KEYS.CURRENT_EDIT_ID);
    
    try {
        console.log('Starting save process for:', formData.contactData, 'Edit mode:', isEditMode);
        
        const success = isEditMode 
            ? await handleEditMode(formData, contactId)
            : await handleCreateMode(formData);
            
        if (!success) return;
        
    } catch (error) {
        console.error('Error saving contact:', error);
        // TODO: Replace with Toast
        alert('Error saving contact. Please check your connection and try again.');
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
    
    console.log('Event listeners initialized');
}

// ================== INITIALIZATION ==================

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing contact system');
    
    if (window.location.pathname.includes('contacts_add_successful.html')) {
        console.log('Success page detected, loading contact data');
        loadContactDataForSuccessPage();
    } 
    else if (window.location.pathname.includes('contacts_edit.html')) {
        console.log('Edit page detected, setting up edit form');
        initializeEventListeners();
        loadContactDataForEditPage();
    }
    else {
        console.log('Add page detected, setting up form');
        initializeEventListeners();
        
        if (NAME_INPUT || EMAIL_INPUT || PHONE_INPUT) {
            validateContactForm();
        }
    }
    
    console.log('Contact management system initialized');
});

// ================== GLOBAL EXPORTS ==================
window.validateContactForm = validateContactForm;
window.closeEditContact = closeEditContact;
window.saveContact = saveContact;
window.clearFormInputs = clearFormInputs;
window.editContact = editContact;
window.deleteContact = deleteContact;
window.deleteContactFromSuccessPage = deleteContactFromSuccessPage;