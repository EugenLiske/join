// MF - Contacts List Management

/**
 * Contacts List Module
 * Manages loading, displaying and interacting with contacts list
 */

// ================== IMPORTS ==================
import { 
    FIREBASE_URL,
    FIREBASE_PATHS,
    PAGES,
    STORAGE_KEYS
} from '../config.js';

import { 
    generateInitials 
} from './contacts_validation.js';

// ================== GLOBAL STATE ==================
let contactsData = {};
let currentSelectedContact = null;

// ================== DOM ELEMENTS ==================
const contactsList = document.getElementById('contacts_list');
const contactDetailsPanel = document.getElementById('contact_details_panel');

// ================== INITIALIZATION ==================
document.addEventListener('DOMContentLoaded', function() {
    loadAllContacts();
});

// ================== CONTACTS LOADING ==================

/**
 * Loads all contacts from Firebase and displays them
 */
async function loadAllContacts() {
    try {
        showLoadingState();
        
        const response = await fetch(`${FIREBASE_URL}${FIREBASE_PATHS.CONTACTS_DATA}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data) {
            showEmptyState();
            return;
        }
        
        contactsData = data;
        displayContactsList(contactsData);
        
    } catch (error) {
        console.error('Error loading contacts:', error);
        showErrorState();
    }
}

/**
 * Displays contacts in alphabetically sorted list with separators
 * @param {Object} contacts - Contacts data from Firebase
 */
function displayContactsList(contacts) {
    if (!contactsList) return;
    
    // Convert contacts object to array and sort alphabetically
    const contactsArray = Object.values(contacts).filter(contact => contact && contact.name);
    contactsArray.sort((a, b) => a.name.localeCompare(b.name));
    
    // Group contacts by first letter
    const groupedContacts = groupContactsByLetter(contactsArray);
    
    // Clear current list
    contactsList.innerHTML = '';
    
    // Create HTML for each letter group
    Object.keys(groupedContacts).sort().forEach(letter => {
        // Add alphabet separator
        const separator = document.createElement('div');
        separator.className = 'alphabet_separator';
        separator.textContent = letter;
        contactsList.appendChild(separator);
        
        // Add contacts for this letter
        groupedContacts[letter].forEach(contact => {
            const contactElement = createContactElement(contact);
            contactsList.appendChild(contactElement);
        });
    });
}

/**
 * Groups contacts by their first letter
 * @param {Array} contactsArray - Array of contact objects
 * @returns {Object} Contacts grouped by first letter
 */
function groupContactsByLetter(contactsArray) {
    return contactsArray.reduce((groups, contact) => {
        const firstLetter = contact.name.charAt(0).toUpperCase();
        if (!groups[firstLetter]) {
            groups[firstLetter] = [];
        }
        groups[firstLetter].push(contact);
        return groups;
    }, {});
}

/**
 * Creates HTML element for a single contact
 * @param {Object} contact - Contact object
 * @returns {HTMLElement} Contact list item element
 */
function createContactElement(contact) {
    const contactItem = document.createElement('div');
    contactItem.className = 'contact_item';
    contactItem.setAttribute('data-contact-id', contact.id); // ← NEU: Für Auto-Selection
    contactItem.onclick = () => selectContact(contact);
    
    const initials = generateInitials(contact.name);
    
    contactItem.innerHTML = `
        <div class="contact_avatar_small" style="background-color: ${contact.avatarColor}">
            ${initials}
        </div>
        <div class="contact_info">
            <div class="contact_name">${contact.name}</div>
            <div class="contact_email">${contact.email}</div>
        </div>
    `;
    
    return contactItem;
}

// ================== CONTACT SELECTION ==================

// Mobile View Functions
function showMobileContactList() {
    document.body.classList.remove('mobile_view_contact_details');

      // 2. Contact Details Panel ausblenden
    if (contactDetailsPanel) {
        contactDetailsPanel.classList.add('d_none');
    }
    
    // 3. Aktuelle Kontakt-Auswahl zurücksetzen
    document.querySelectorAll('.contact_item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // 4. Globalen Status zurücksetzen
    currentSelectedContact = null;
}

/**
 * Selects a contact and shows details panel mit Toggle-Funktionalität
 * @param {Object} contact - Selected contact object
 */
function selectContact(contact) {
    const clickedItem = event.currentTarget;
    
    // NEU: Toggle-Funktionalität - Prüfen ob der gleiche Kontakt bereits ausgewählt ist
    if (currentSelectedContact && currentSelectedContact.id === contact.id) {
        // Gleicher Kontakt → Toggle (ausblenden)
        clickedItem.classList.remove('selected');
        contactDetailsPanel.classList.add('d_none');
        currentSelectedContact = null;
        return;
    }
    
    // Anderer Kontakt → Vorherige Auswahl entfernen
    document.querySelectorAll('.contact_item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Neuen Kontakt auswählen
    clickedItem.classList.add('selected');
    currentSelectedContact = contact;
    
    // Details anzeigen
    displayContactDetails(contact);

    if (window.innerWidth <= 600) {
    document.body.classList.add('mobile_view_contact_details');
}
}

/**
 * Displays contact details in the right panel
 * @param {Object} contact - Contact object to display
 */
function displayContactDetails(contact) {
    if (!contactDetailsPanel) return;
    
    const initials = generateInitials(contact.name);
    
    contactDetailsPanel.innerHTML = `
        <div class="contact_details_header">
            <div class="contact_details_avatar" style="background-color: ${contact.avatarColor}">
                ${initials}
            </div>
            <div class="contact_details_info">
                <h1 class="contact_details_name">${contact.name}</h1>
                <div class="contact_details_actions">
                    <button class="contact_action_button" onclick="editSelectedContact()">
                        <img src="../assets/img/icons/edit_and_delete/edit.svg" alt="Edit">
                        <span>Edit</span>
                    </button>
                    <button class="contact_action_button" onclick="deleteSelectedContact()">
                        <img src="../assets/img/icons/edit_and_delete/delete.svg" alt="Delete">
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="contact_details_body">
            <h2 class="contact_details_section_title">Contact Information</h2>
            <div class="contact_details_field">
                <div class="contact_details_field_label">Email</div>
                <div class="contact_details_field_value email">${contact.email}</div>
            </div>
            <div class="contact_details_field">
                <div class="contact_details_field_label">Phone</div>
                <div class="contact_details_field_value phone">${contact.phone || 'No phone number'}</div>
            </div>
        </div>
    `;
    
    // Show panel with animation
    contactDetailsPanel.classList.remove('d_none');
    contactDetailsPanel.classList.add('show');
}

/**
 * Selects a contact by ID automatically (like manual click)
 * @param {number|string} contactId - Contact ID to select
 */
function selectContactById(contactId) {
    console.log('=== selectContactById called ===');
    console.log('Looking for contact ID:', contactId);
    console.log('Available contacts in contactsData:', Object.keys(contactsData));
    
    // Kontakt in contactsData finden
    const contact = Object.values(contactsData).find(c => c && c.id == contactId);
    
    console.log('Found contact:', contact);
    
    if (contact) {
        // Alle vorherigen Auswahlen entfernen
        document.querySelectorAll('.contact_item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Den entsprechenden DOM-Eintrag visuell markieren
        const contactElement = document.querySelector(`[data-contact-id="${contactId}"]`);
        console.log('Found DOM element:', contactElement);
        
        if (contactElement) {
            contactElement.classList.add('selected');
        }
        
        // Globalen Status setzen und Details anzeigen
        currentSelectedContact = contact;
        displayContactDetails(contact);
        
        console.log('Contact successfully selected:', contact.name);
    } else {
        console.log('ERROR: Contact not found with ID:', contactId);
    }
}

// ================== OVERLAY MANAGEMENT ==================

/**
 * Opens the Add Contact overlay
 */
async function openAddContactOverlay() {
    try {
        const response = await fetch('../overlays/contacts/contacts_add.html');
        const html = await response.text();
        
        const overlay = document.getElementById('add_contact_overlay');
        overlay.innerHTML = html;
        overlay.classList.remove('d_none');
        
        // Initialize overlay scripts
        await loadContactScripts();
        initializeAddContactOverlay();
        
    } catch (error) {
        console.error('Error loading add contact overlay:', error);
    }
}

/**
 * Lädt die Contact-Scripts dynamisch nach
 */
async function loadContactScripts() {
    return new Promise((resolve) => {
        // Prüfen ob Scripts bereits geladen sind
        if (window.saveContact) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = '../scripts/contacts/contacts.js';
        script.type = 'module';
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

/**
 * Opens the Edit Contact overlay for selected contact
 */
async function editSelectedContact() {
    if (!currentSelectedContact) return;
    
    console.log('=== editSelectedContact called ===');
    console.log('Current selected contact:', currentSelectedContact);
    
    try {
        // NEU: Mobile View deaktivieren damit Pfeil verschwindet
        document.body.classList.remove('mobile_view_contact_details');

        localStorage.setItem(STORAGE_KEYS.CURRENT_EDIT_ID, currentSelectedContact.id);
        console.log('Stored in localStorage:', currentSelectedContact.id);
        
        const response = await fetch('../overlays/contacts/contacts_edit.html');
        const html = await response.text();
        console.log('Edit HTML loaded, length:', html.length);
        
        const overlay = document.getElementById('edit_contact_overlay');
        overlay.innerHTML = html;
        overlay.classList.remove('d_none');
        
        await loadContactScripts();
        console.log('Contact scripts loaded');
        
        initializeEditContactOverlay();
        console.log('Edit overlay initialized');
        
    } catch (error) {
        console.error('Error loading edit contact overlay:', error);
    }
}

/**
 * Deletes the selected contact
 */
async function deleteSelectedContact() {
    if (!currentSelectedContact) return;
    
    try {
        closeMobileActionMenu();
        
        const response = await fetch(`${FIREBASE_URL}${FIREBASE_PATHS.SINGLE_CONTACT(currentSelectedContact.id)}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete contact');
        }
        
        showToastMessage('Contact deleted successfully', 'success');
        
        contactDetailsPanel.classList.add('d_none');
        currentSelectedContact = null;
        
        setTimeout(() => {
            loadAllContacts();
        }, 1000);
        
    } catch (error) {
        console.error('Error deleting contact:', error);
        showToastMessage('Error deleting contact. Please try again.', 'error');
    }
}

// ================== OVERLAY INITIALIZATION ==================

/**
 * Initializes the Add Contact overlay
 */
function initializeAddContactOverlay() {
    const closeBtn = document.querySelector('#add_contact_overlay .close_button');
    if (closeBtn) {
        closeBtn.onclick = closeAddContactOverlay;
    }
    
    const overlay = document.getElementById('add_contact_overlay');
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            closeAddContactOverlay();
        }
    };
    
    const originalSaveContact = window.saveContact;
    window.saveContact = async (event) => {
        const result = await originalSaveContact(event);
        if (result !== false) {
            closeAddContactOverlay();
            showToastMessage('Contact created successfully', 'success');
            
            setTimeout(async () => {
                await loadAllContacts();
                const allContacts = Object.values(contactsData).filter(c => c && c.id);
                const newestContact = allContacts.reduce((prev, current) => {
                    return (prev.id > current.id) ? prev : current;
                });
                
                console.log('Newest contact by ID:', newestContact);
                
                if (newestContact) {
                    selectContactById(newestContact.id);
                }
                
            }, 1000);
        }
        return result;
    };
}

/**
 * Initializes the Edit Contact overlay
 */
function initializeEditContactOverlay() {
    const closeBtn = document.querySelector('#edit_contact_overlay .close_button');
    if (closeBtn) {
        closeBtn.onclick = closeEditContactOverlay;
    }
    
    const overlay = document.getElementById('edit_contact_overlay');
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            closeEditContactOverlay();
        }
    };
    
    // Formular befüllen
    if (currentSelectedContact) {
        setTimeout(() => {
            const nameInput = document.getElementById('name_input');
            const emailInput = document.getElementById('email_input');
            const phoneInput = document.getElementById('telephone_input');
            
            if (nameInput) nameInput.value = currentSelectedContact.name || '';
            if (emailInput) emailInput.value = currentSelectedContact.email || '';
            if (phoneInput) phoneInput.value = currentSelectedContact.phone || '';
            
            if (window.validateContactForm) {
                window.validateContactForm();
            }
        }, 200);
    }
    
    const originalSaveContact = window.saveContact;
    window.saveContact = async (event) => {
        const editedContactId = currentSelectedContact?.id;
        let result = false;
        
        try {
            result = await originalSaveContact(event);
            
            if (result === true) {
                closeEditContactOverlay();
                showToastMessage('Contact updated successfully', 'success');
                
                setTimeout(async () => {
                    await loadAllContacts();
                    
                    if (editedContactId) {
                        selectContactById(editedContactId);
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Save failed with error:', error);
            result = false;
        }
        
        return result;
    };
}

// Original Email-Prüfung beibehalten
async function originalCheckEmailInFirebase(email) {
    try {
        const response = await fetch(`${FIREBASE_URL}${FIREBASE_PATHS.CONTACTS_DATA}`);
        const contacts = await response.json();
        
        if (!contacts) return false;
        
        const emailLower = email.toLowerCase();
        
        for (const contact of Object.values(contacts)) {
            if (contact && contact.email && contact.email.toLowerCase() === emailLower) {
                return true; // Email existiert
            }
        }
        
        return false; // Email ist frei
    } catch (error) {
        console.error('Error checking email:', error);
        return false;
    }
}

/**
 * Loads updated contact data after edit
 * @param {number} contactId - Contact ID to reload
 * @returns {Promise<Object|null>} Updated contact data
 */
async function loadUpdatedContact(contactId) {
    try {
        const response = await fetch(`${FIREBASE_URL}${FIREBASE_PATHS.SINGLE_CONTACT(contactId)}`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Error loading updated contact:', error);
    }
    return null;
}

/**
 * Closes the Add Contact overlay
 */
function closeAddContactOverlay() {
    const overlay = document.getElementById('add_contact_overlay');
    overlay.classList.add('d_none');
    overlay.innerHTML = '';
}

/**
 * Closes the Edit Contact overlay
 */
function closeEditContactOverlay() {
    const overlay = document.getElementById('edit_contact_overlay');
    overlay.classList.add('d_none');
    overlay.innerHTML = '';
    localStorage.removeItem(STORAGE_KEYS.CURRENT_EDIT_ID);

    closeMobileActionMenu();
    
    // Mobile View wieder aktivieren wenn unter 600px UND ein Kontakt ausgewählt ist
    if (window.innerWidth <= 600 && currentSelectedContact) {
        setTimeout(() => {
            document.body.classList.add('mobile_view_contact_details');
        }, 100);
    }
}

// ================== STATE MANAGEMENT ==================

/**
 * Shows loading state
 */
function showLoadingState() {
    if (!contactsList) return;
    
    contactsList.innerHTML = `
        <div class="contacts_loading">
            <div class="loading_spinner"></div>
        </div>
    `;
}

/**
 * Shows empty state when no contacts exist
 */
function showEmptyState() {
    if (!contactsList) return;
    
    contactsList.innerHTML = `
        <div class="contacts_empty_state">
            <img src="../assets/img/icons/form/person.svg" alt="No contacts">
            <h3>No contacts yet</h3>
            <p>Click "New contact" to add your first contact</p>
        </div>
    `;
}

/**
 * Shows error state when loading fails
 */
function showErrorState() {
    if (!contactsList) return;
    
    contactsList.innerHTML = `
        <div class="contacts_empty_state">
            <h3>Error loading contacts</h3>
            <p>Please check your connection and try again</p>
        </div>
    `;
}

/**
 * Shows toast message
 * @param {string} message - Message to display
 * @param {string} type - Type of message (success, error, warning)
 */
function showToastMessage(message, type = 'success') {
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
    }, 2000);
}

window.addEventListener('resize', function() {
    if (window.innerWidth <= 600) {
        // Unter 600px: Prüfen ob ein Kontakt ausgewählt ist
        if (!currentSelectedContact) {
            // Kein Kontakt ausgewählt → Zurück zur Kontaktliste
            document.body.classList.remove('mobile_view_contact_details');
        }
    } else {
        // Über 600px: Mobile View Class entfernen
        document.body.classList.remove('mobile_view_contact_details');
    }
});

/**
 * Toggles the mobile action menu
 */
function toggleMobileActionMenu() {
    const menu = document.getElementById('mobile_action_menu');
    const overlay = document.getElementById('mobile_menu_overlay');
    
    if (menu && overlay) {
        const isVisible = menu.classList.contains('show');
        
        if (isVisible) {
            closeMobileActionMenu();
        } else {
            openMobileActionMenu();
        }
    }
}

/**
 * Opens the mobile action menu
 */
function openMobileActionMenu() {
    const menu = document.getElementById('mobile_action_menu');
    const overlay = document.getElementById('mobile_menu_overlay');
    
    if (menu && overlay) {
        overlay.classList.add('show');
        setTimeout(() => {
            menu.classList.add('show');
        }, 50);
    }
}

/**
 * Closes the mobile action menu
 */
function closeMobileActionMenu() {
    const menu = document.getElementById('mobile_action_menu');
    const overlay = document.getElementById('mobile_menu_overlay');
    
    if (menu && overlay) {
        menu.classList.remove('show');
        setTimeout(() => {
            overlay.classList.remove('show');
        }, 300);
    }
}

// Am Ende zu den anderen window exports hinzufügen:
window.toggleMobileActionMenu = toggleMobileActionMenu;
window.closeMobileActionMenu = closeMobileActionMenu;

// ================== GLOBAL EXPORTS ==================
window.openAddContactOverlay = openAddContactOverlay;
window.editSelectedContact = editSelectedContact;
window.deleteSelectedContact = deleteSelectedContact;
window.showMobileContactList = showMobileContactList;