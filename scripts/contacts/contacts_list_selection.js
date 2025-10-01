// MF - contacts_list_selection.js
/**
 * Contacts List - Selection Logic
 * Handles contact selection and deselection
 */

import { contactsData } from './contacts_list_data.js';
import { displayContactDetails, hideContactDetailsPanel } from './contacts_list_ui.js';

// ================== GLOBAL STATE ==================
export let currentSelectedContact = null;

// ================== DOM ELEMENTS ==================
const contactDetailsPanel = document.getElementById('contact_details_panel');

// ================== SELECTION FUNCTIONS ==================

/**
 * Selects a contact and shows details panel with toggle functionality
 * @param {Object} contact - Selected contact object
 */
export function selectContact(contact) {
    const clickedItem = event.currentTarget;
    
    if (currentSelectedContact && currentSelectedContact.id === contact.id) {
        deselectCurrentContact(clickedItem);
        return;
    }
    
    selectNewContact(contact, clickedItem);
}

function deselectCurrentContact(clickedItem) {
    clickedItem.classList.remove('selected');
    hideContactDetailsPanel();
    currentSelectedContact = null;
}

function selectNewContact(contact, clickedItem) {
    document.querySelectorAll('.contact_item').forEach(item => {
        item.classList.remove('selected');
    });
    
    clickedItem.classList.add('selected');
    currentSelectedContact = contact;
    
    displayContactDetails(contact);

    if (window.innerWidth <= 600) {
        document.body.classList.add('mobile_view_contact_details');
    }
}

/**
 * Selects a contact by ID automatically
 * @param {number|string} contactId - Contact ID to select
 */
export function selectContactById(contactId) {
    const contact = Object.values(contactsData).find(c => c && c.id == contactId);
    
    if (contact) {
        updateContactSelection(contact, contactId);
    }
}

function updateContactSelection(contact, contactId) {
    document.querySelectorAll('.contact_item').forEach(item => {
        item.classList.remove('selected');
    });
    
    const contactElement = document.querySelector(`[data-contact-id="${contactId}"]`);
    
    if (contactElement) {
        contactElement.classList.add('selected');
    }
    
    currentSelectedContact = contact;
    displayContactDetails(contact);
}

/**
 * Shows mobile contact list view
 */
export function showMobileContactList() {
    document.body.classList.remove('mobile_view_contact_details');
    hideContactDetailsPanel();
    
    document.querySelectorAll('.contact_item').forEach(item => {
        item.classList.remove('selected');
    });
    
    currentSelectedContact = null;
}

export function getCurrentSelectedContact() {
    return currentSelectedContact;
}