// MF contact_firebase_api.js

/**
 * Contacts Firebase API Module
 * All Firebase database operations for contact management
 */

import { 
    FIREBASE_URL, 
    AVATAR_COLORS, 
    FIREBASE_PATHS,
    DEFAULTS
} from '../config.js';

/**
 * Retrieves and increments the contact counter for new contact IDs
 * @returns {Promise<number>} Next available contact ID
 */
export async function getNextContactId() {
    try {
        const counterUrl = `${FIREBASE_URL}${FIREBASE_PATHS.COUNTER}`;
        
        const response = await fetch(counterUrl);
        let currentCounter = DEFAULTS.START_COUNTER;
        
        if (response.ok) {
            const data = await response.json();
            currentCounter = data || DEFAULTS.START_COUNTER;
        }
        
        const nextId = currentCounter + 1;
        
        await fetch(counterUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nextId)
        });
        
        return nextId;
        
    } catch (error) {
        console.error('Error getting next contact ID:', error);
        return Date.now();
    }
}

/**
 * Checks if an email address already exists in the database
 * @param {string} email - Email address to check
 * @returns {Promise<boolean>} True if email exists
 */
export async function checkEmailExists(email) {
    try {
        const contactsUrl = `${FIREBASE_URL}${FIREBASE_PATHS.CONTACTS_DATA}`;
        const response = await fetch(contactsUrl);
        
        if (!response.ok) return false;
        
        const contacts = await response.json();
        if (!contacts) return false;
        
        const emailLower = email.toLowerCase();
        
        for (const contact of Object.values(contacts)) {
            if (contact && contact.email && contact.email.toLowerCase() === emailLower) {
                return true;
            }
        }
        
        return false;
        
    } catch (error) {
        console.error('Error checking email existence:', error);
        return false;
    }
}

/**
 * Checks if an email exists for edit mode (excludes current contact's email)
 * @param {string} email - Email address to check
 * @param {number} currentContactId - ID of contact being edited to exclude from check
 * @returns {Promise<boolean>} True if email exists in another contact
 */
// 

export async function checkEmailExistsForEdit(email, currentContactId) {
    try {
        const contactsUrl = `${FIREBASE_URL}${FIREBASE_PATHS.CONTACTS_DATA}`;
        const response = await fetch(contactsUrl);
        
        if (!response.ok) return false;
        
        const contacts = await response.json();
        if (!contacts) return false;
        
        const emailLower = email.toLowerCase();
        
        // Konvertiere currentContactId zu Number für sichere Vergleiche
        const currentId = parseInt(currentContactId);
        
        for (const contact of Object.values(contacts)) {
            if (contact && contact.email && contact.email.toLowerCase() === emailLower) {
                // Wenn die E-Mail zum aktuellen Kontakt gehört → erlauben (return false)
                if (parseInt(contact.id) === currentId) {
                    return false;
                }
                return true;
            }
        }
        
        // E-Mail existiert nirgends → erlauben
        return false;
        
    } catch (error) {
        return false;
    }
}

/**
 * Assigns a random avatar color from predefined palette
 * @returns {string} CSS variable for avatar background color
 */
export function assignRandomAvatarColor() {
    const randomIndex = Math.floor(Math.random() * AVATAR_COLORS.length);
    return AVATAR_COLORS[randomIndex];
}

/**
 * Loads existing contact data from Firebase
 * @param {number} contactId - ID of contact to load
 * @returns {Promise<Object|null>} Contact data object or null if not found
 */
export async function loadExistingContact(contactId) {
    try {
        const contactUrl = `${FIREBASE_URL}${FIREBASE_PATHS.SINGLE_CONTACT(contactId)}`;
        const response = await fetch(contactUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to load contact: ${response.statusText}`);
        }
        
        const contactData = await response.json();
        return contactData;
        
    } catch (error) {
        return null;
    }
}

/**
 * Saves a new contact to Firebase with auto-generated ID and metadata
 * @param {Object} contactData - Contact data (name, email, phone)
 * @returns {Promise<Object>} Complete contact object with metadata
 */
export async function saveContactToFirebase(contactData) {
    const contactId = await getNextContactId();
    
    const contactWithMetadata = {
        ...contactData,
        id: contactId,
        avatarColor: assignRandomAvatarColor(),
        createdAt: new Date().toISOString()
    };
    
    const contactUrl = `${FIREBASE_URL}${FIREBASE_PATHS.SINGLE_CONTACT(contactId)}`;
    const response = await fetch(contactUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactWithMetadata)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to save contact: ${response.statusText}`);
    }
    return contactWithMetadata;
}

/**
 * Updates existing contact in Firebase without changing ID or counter
 * @param {number} contactId - ID of contact to update
 * @param {Object} contactData - Updated contact data (name, email, phone)
 * @returns {Promise<Object>} Updated contact object with preserved metadata
 */
export async function saveEditContactToFirebase(contactId, contactData) {
    try {
        // Get existing contact to preserve metadata
        const existingContact = await loadExistingContact(contactId);
        if (!existingContact) {
            throw new Error('Contact not found for editing');
        }
        
        const updatedContact = {
            ...existingContact,           // Preserve id, avatarColor, createdAt
            ...contactData,               // Update name, email, phone
            updatedAt: new Date().toISOString()
        };
        
        const contactUrl = `${FIREBASE_URL}${FIREBASE_PATHS.SINGLE_CONTACT(contactId)}`;
        const response = await fetch(contactUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedContact)
        });
        
        if (!response.ok) {
            throw new Error(`Failed to update contact: ${response.statusText}`);
        }
        return updatedContact;
        
    } catch (error) {
        console.error('Error updating contact:', error);
        throw error;
    }
}

/**
 * Deletes contact from Firebase without affecting counter
 * @param {number} contactId - ID of contact to delete
 * @returns {Promise<boolean>} True if deletion successful
 */
export async function deleteContactFromFirebase(contactId) {
    try {
        const contactUrl = `${FIREBASE_URL}${FIREBASE_PATHS.SINGLE_CONTACT(contactId)}`;
        const response = await fetch(contactUrl, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`Failed to delete contact: ${response.statusText}`);
        }
        return true;
        
    } catch (error) {
        throw error;
    }
}