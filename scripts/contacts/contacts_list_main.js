// MF - contacts_list_main.js
/**
 * Contacts List - Main Entry Point
 * Initializes and coordinates all contact list functionality
 */

import { loadAllContacts } from './contacts_list_data.js';
import { 
    openAddContactOverlay, 
    editSelectedContact, 
    deleteSelectedContact 
} from './contacts_list_overlays.js';
import { showMobileContactList } from './contacts_list_selection.js';
import { 
    toggleMobileActionMenu, 
    closeMobileActionMenu,
    initializeMobileResizeHandler 
} from './contacts_list_mobile.js';

// ================== INITIALIZATION ==================
document.addEventListener('DOMContentLoaded', function() {
    loadAllContacts();
    initializeMobileResizeHandler();
});

// ================== GLOBAL EXPORTS ==================
window.openAddContactOverlay = openAddContactOverlay;
window.editSelectedContact = editSelectedContact;
window.deleteSelectedContact = deleteSelectedContact;
window.showMobileContactList = showMobileContactList;
window.toggleMobileActionMenu = toggleMobileActionMenu;
window.closeMobileActionMenu = closeMobileActionMenu;