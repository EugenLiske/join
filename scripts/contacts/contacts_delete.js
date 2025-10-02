// MF - contacts_delete.js
/**
 * Contact Form - Delete Operations
 * Handles contact deletion
 */

import { PAGES, STORAGE_KEYS } from '../config.js';
import { showOverlayMessage } from './contacts_ui_helpers.js';
import { deleteContactFromFirebase } from './contacts_firebase_api.js';

// ================== DELETE FROM EDIT PAGE ==================

/**
 * Deletes contact from edit page and navigates back
 */
export async function deleteContact() {
    const contactId = localStorage.getItem(STORAGE_KEYS.CURRENT_EDIT_ID);
    
    if (!contactId) {
        return;
    }
    
    try {
        showOverlayMessage('Deleting contact...', 'warning', 1000);
        
        await deleteContactFromFirebase(parseInt(contactId));
        
        showOverlayMessage('Contact deleted successfully', 'success', 1500);
        
        setTimeout(() => {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_EDIT_ID);        
            window.location.href = PAGES.MAIN_PAGE;
        }, 1800);
        
    } catch (error) {
        showOverlayMessage('Error deleting contact. Please try again.', 'error', 3000);
    }
}

// ================== DELETE FROM SUCCESS PAGE ==================

/**
 * Deletes contact from success page and navigates to add contact
 * @param {number} contactId - ID of contact to delete
 */
export async function deleteContactFromSuccessPage(contactId) {
    try {        
        await deleteContactFromFirebase(parseInt(contactId));
        
        showOverlayMessage('Contact deleted successfully', 'success', 1800);
        
        setTimeout(() => {
            localStorage.removeItem(STORAGE_KEYS.LAST_SAVED_CONTACT);
            window.location.href = PAGES.ADD_CONTACT;
        }, 2000);
        
    } catch (error) {
        showOverlayMessage('Error deleting contact. Please try again.', 'error', 3000);
    }
}

// ================== GLOBAL EXPORTS ==================
window.deleteContactFromSuccessPage = deleteContactFromSuccessPage;