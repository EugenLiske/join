// MF - contacts_navigation.js
/**
 * Contact Form - Navigation & Success Page
 * Handles page navigation and success page display
 */

import { PAGES, STORAGE_KEYS } from '../config.js';
import { 
    displayContactSuccess,
    displayContactDataInForm,
    showOverlayMessage 
} from './contacts_ui_helpers.js';
import { loadExistingContact } from './contacts_firebase_api.js';

// ================== NAVIGATION ==================

/**
 * Navigates to success page with contact data
 * @param {Object} contactData - Contact data to display on success page
 */
export function navigateToSuccessPage(contactData) {
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED_CONTACT, JSON.stringify(contactData));
}

/**
 * Navigates to edit page with contact ID
 * @param {number} contactId - ID of contact to edit
 */
export function editContact(contactId) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_EDIT_ID, contactId);
    window.location.href = PAGES.EDIT_CONTACT;
}

// ================== SUCCESS PAGE ==================

/**
 * Loads and displays contact data for success page
 */
export function loadContactDataForSuccessPage() {
    const contactDataJSON = localStorage.getItem(STORAGE_KEYS.LAST_SAVED_CONTACT);
    
    if (contactDataJSON) {
        try {
            const contactData = JSON.parse(contactDataJSON);
            displayContactSuccess(contactData);
            setupClickOutsideToClose();
            
            setTimeout(() => {
                showOverlayMessage('Contact successfully created!', 'success', 3000);
            }, 500);
            
        } catch (error) {
            // Error handling
        }
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

// ================== EDIT PAGE ==================

/**
 * Auto-loads contact data when edit page loads
 */
export function loadContactDataForEditPage() {
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
        
        if (window.validateContactForm) {
            window.validateContactForm();
        }
        
        return contactData;
        
    } catch (error) {
        handleContactLoadError(error);
        return null;
    }
}

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

// ================== GLOBAL EXPORTS ==================
window.editContact = editContact;