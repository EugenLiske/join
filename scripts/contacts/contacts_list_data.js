// MF - contacts_list_data.js
/**
 * Contacts List - Data Management
 * Loading, sorting, and grouping contacts data
 */

import { 
    FIREBASE_URL,
    FIREBASE_PATHS
} from '../config.js';

import { generateInitials } from './contacts_validation.js';
import { displayContactsList } from './contacts_list_ui.js';

// ================== GLOBAL STATE ==================
export let contactsData = {};

// ================== DOM ELEMENTS ==================
const contactsList = document.getElementById('contacts_list');

// ================== CONTACTS LOADING ==================

/**
 * Loads all contacts from Firebase and displays them
 */
export async function loadAllContacts() {
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
        showErrorState();
    }
}

/**
 * Groups contacts by their first letter
 * @param {Array} contactsArray - Array of contact objects
 * @returns {Object} Contacts grouped by first letter
 */
export function groupContactsByLetter(contactsArray) {
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
export function createContactElement(contact, selectContactCallback) {
    const contactItem = document.createElement('div');
    contactItem.className = 'contact_item';
    contactItem.setAttribute('data-contact-id', contact.id);
    contactItem.onclick = () => selectContactCallback(contact);
    
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
export function showToastMessage(message, type = 'success') {
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