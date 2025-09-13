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

/**
 * Selects a contact and shows details panel
 * @param {Object} contact - Selected contact object
 */
function selectContact(contact) {
    // Remove previous selection
    document.querySelectorAll('.contact_item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Add selection to clicked item
    event.currentTarget.classList.add('selected');
    
    // Store current selection
    currentSelectedContact = contact;
    
    // Show contact details
    displayContactDetails(contact);
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
        initializeAddContactOverlay();
        
    } catch (error) {
        console.error('Error loading add contact overlay:', error);
    }
}

/**
 * Opens the Edit Contact overlay for selected contact
 */
async function editSelectedContact() {
    if (!currentSelectedContact) return;
    
    try {
        // Store contact ID for edit overlay
        localStorage.setItem(STORAGE_KEYS.CURRENT_EDIT_ID, currentSelectedContact.id);
        
        const response = await fetch('../overlays/contacts/contacts_edit.html');
        const html = await response.text();
        
        const overlay = document.getElementById('edit_contact_overlay');
        overlay.innerHTML = html;
        overlay.classList.remove('d_none');
        
        // Initialize overlay scripts
        initializeEditContactOverlay();
        
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
        const response = await fetch(`${FIREBASE_URL}${FIREBASE_PATHS.SINGLE_CONTACT(currentSelectedContact.id)}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete contact');
        }
        
        // Show success message
        showToastMessage('Contact deleted successfully', 'success');
        
        // Hide details panel
        contactDetailsPanel.classList.add('d_none');
        currentSelectedContact = null;
        
        // Reload contacts list
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
    // Add close button functionality
    const closeBtn = document.querySelector('#add_contact_overlay .close_button');
    if (closeBtn) {
        closeBtn.onclick = closeAddContactOverlay;
    }
    
    // Add click outside to close
    const overlay = document.getElementById('add_contact_overlay');
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            closeAddContactOverlay();
        }
    };
    
    // Override save success to refresh list
    const originalSaveContact = window.saveContact;
    window.saveContact = async (event) => {
        const result = await originalSaveContact(event);
        if (result !== false) {
            closeAddContactOverlay();
            setTimeout(() => {
                loadAllContacts();
            }, 1000);
        }
        return result;
    };
}

/**
 * Initializes the Edit Contact overlay
 */
function initializeEditContactOverlay() {
    // Add close button functionality
    const closeBtn = document.querySelector('#edit_contact_overlay .close_button');
    if (closeBtn) {
        closeBtn.onclick = closeEditContactOverlay;
    }
    
    // Add click outside to close
    const overlay = document.getElementById('edit_contact_overlay');
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            closeEditContactOverlay();
        }
    };
    
    // Override save success to refresh list
    const originalSaveContact = window.saveContact;
    window.saveContact = async (event) => {
        const result = await originalSaveContact(event);
        if (result !== false) {
            closeEditContactOverlay();
            setTimeout(async () => {
                loadAllContacts();
                // Reselect updated contact
                if (currentSelectedContact) {
                    const updatedContact = await loadUpdatedContact(currentSelectedContact.id);
                    if (updatedContact) {
                        displayContactDetails(updatedContact);
                        currentSelectedContact = updatedContact;
                    }
                }
            }, 1000);
        }
        return result;
    };
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

// ================== GLOBAL EXPORTS ==================
window.openAddContactOverlay = openAddContactOverlay;
window.editSelectedContact = editSelectedContact;
window.deleteSelectedContact = deleteSelectedContact;