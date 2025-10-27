// MF - contacts_save.js
/**
 * Contact Form - Save Operations
 * Handles creating and updating contacts
 */

import { STORAGE_KEYS } from '../config.js';
import { getFormData } from './contacts_validation.js';
import { showOverlayMessage, clearFormInputs } from './contacts_ui_helpers.js';
import { 
    checkEmailExists,
    checkEmailExistsForEdit,
    saveContactToFirebase,
    saveEditContactToFirebase,
    loadExistingContact
} from './contacts_firebase_api.js';
import { navigateToSuccessPage } from './contacts_navigation.js';

// ================== CREATE MODE ==================

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
    
    showOverlayMessage('Contact saved successfully', 'success', 1500);
    clearFormInputs();
    
    setTimeout(() => {
        navigateToSuccessPage(savedContact);
    }, 1800);
    
    return true;
}

// ================== EDIT MODE ==================

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
    
    const emailChanged = hasEmailChanged(formData.email, existingContact.email);
    
    if (emailChanged) {
        const isDuplicate = await checkForDuplicateEmail(formData.email, contactId);
        if (isDuplicate) return false;
    }
    
    await saveEditContactToFirebase(parseInt(contactId), formData.contactData);
    showOverlayMessage('Contact updated successfully', 'success', 1500);
    
    return true;
}

function hasEmailChanged(newEmail, existingEmail) {
    return newEmail.toLowerCase() !== existingEmail.toLowerCase();
}

async function checkForDuplicateEmail(email, currentContactId) {
    const emailExists = await checkEmailExistsForEdit(email, parseInt(currentContactId));
    
    if (emailExists) {
        showOverlayMessage('This email address is already in use. Please use a different email.', 'error', 3000);
        return true;
    }
    
    return false;
}

// ================== MAIN SAVE FUNCTION ==================

/**
 * Main save function - coordinates CREATE/EDIT operations
 * @param {Event} event - Form submit event
 */
export async function saveContact(event) {
    if (event) event.preventDefault();
    
    const formData = getFormData();
    if (!formData.isValid) {
        showOverlayMessage('Please correct the form errors before saving.');
        return false;
    }
    console.log('Form data:', formData); // Debug log
        
    const contactId = localStorage.getItem(STORAGE_KEYS.CURRENT_EDIT_ID);
    const isEditMode = contactId !== null;
    
    return await executeSave(formData, isEditMode, contactId);
}

async function executeSave(formData, isEditMode, contactId) {
    try {
        const success = isEditMode 
            ? await handleEditMode(formData, contactId)
            : await handleCreateMode(formData);
        
        return success;
    } catch (error) {
        console.error('Save error:', error);
        showOverlayMessage('Error saving contact. Please check your connection and try again.');
        return false;
    }
}