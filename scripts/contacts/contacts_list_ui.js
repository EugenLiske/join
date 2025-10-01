// MF - contacts_list_ui.js
/**
 * Contacts List - UI Rendering
 * Displays contact list and detail views
 */

import { generateInitials } from './contacts_validation.js';
import { groupContactsByLetter, createContactElement } from './contacts_list_data.js';
import { selectContact } from './contacts_list_selection.js';

// ================== DOM ELEMENTS ==================
const contactsList = document.getElementById('contacts_list');
const contactDetailsPanel = document.getElementById('contact_details_panel');

// ================== LIST RENDERING ==================

/**
 * Displays contacts in alphabetically sorted list with separators
 * @param {Object} contacts - Contacts data from Firebase
 */
export function displayContactsList(contacts) {
    if (!contactsList) return;
    
    const contactsArray = prepareContactsArray(contacts);
    const groupedContacts = groupContactsByLetter(contactsArray);
    
    renderContactGroups(groupedContacts);
}

function prepareContactsArray(contacts) {
    const contactsArray = Object.values(contacts).filter(contact => contact && contact.name);
    contactsArray.sort((a, b) => a.name.localeCompare(b.name));
    return contactsArray;
}

function renderContactGroups(groupedContacts) {
    contactsList.innerHTML = '';
    
    Object.keys(groupedContacts).sort().forEach(letter => {
        const separator = document.createElement('div');
        separator.className = 'alphabet_separator';
        separator.textContent = letter;
        contactsList.appendChild(separator);
        
        groupedContacts[letter].forEach(contact => {
            contactsList.appendChild(createContactElement(contact, selectContact));
        });
    });
}

// ================== DETAIL VIEW RENDERING ==================

/**
 * Displays contact details in the right panel
 * @param {Object} contact - Contact object to display
 */
export function displayContactDetails(contact) {
    if (!contactDetailsPanel) return;
    
    contactDetailsPanel.innerHTML = createContactDetailsHTML(contact);
    showContactDetailsPanel();
}

function createContactDetailsHTML(contact) {
    const initials = generateInitials(contact.name);
    
    return `
        <div class="contact_details_header">
            ${createContactHeader(contact, initials)}
        </div>
        <div class="contact_details_body">
            ${createContactBody(contact)}
        </div>
    `;
}

function createContactHeader(contact, initials) {
    return `
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
    `;
}

function createContactBody(contact) {
    return `
        <h2 class="contact_details_section_title">Contact Information</h2>
        <div class="contact_details_field">
            <div class="contact_details_field_label">Email</div>
            <div class="contact_details_field_value email">${contact.email}</div>
        </div>
        <div class="contact_details_field">
            <div class="contact_details_field_label">Phone</div>
            <div class="contact_details_field_value phone">${contact.phone || 'No phone number'}</div>
        </div>
    `;
}

function showContactDetailsPanel() {
    contactDetailsPanel.classList.remove('d_none');
    contactDetailsPanel.classList.add('show');
}

export function hideContactDetailsPanel() {
    if (!contactDetailsPanel) return;
    contactDetailsPanel.classList.add('d_none');
}