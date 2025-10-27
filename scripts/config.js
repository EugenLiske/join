//MF 

/**
 * Central Configuration for Join Contact Management
 * All constants, URLs, and settings in one place
 */

// Firebase Configuration
export const FIREBASE_URL = "https://join---kanban-board-default-rtdb.europe-west1.firebasedatabase.app";

// Avatar Colors from CSS Variables (15 predefined colors)
export const AVATAR_COLORS = [
    'var(--c-pf-var1)',  // #FF7A00
    'var(--c-pf-var2)',  // #FF5EB3
    'var(--c-pf-var3)',  // #6E52FF
    'var(--c-pf-var4)',  // #9327FF
    'var(--c-pf-var5)',  // #00BEE8
    'var(--c-pf-var6)',  // #1FD7C1
    'var(--c-pf-var7)',  // #FF745E
    'var(--c-pf-var8)',  // #FFA35E
    'var(--c-pf-var9)',  // #FC71FF
    'var(--c-pf-var10)', // #FFC701
    'var(--c-pf-var11)', // #0038FF
    'var(--c-pf-var12)', // #C3FF2B
    'var(--c-pf-var13)', // #FFE62B
    'var(--c-pf-var14)', // #FF4646
    'var(--c-pf-var15)'  // #FFBB2B
];

// Page URLs for Navigation
export const PAGES = {
    ADD_CONTACT: '../overlays/contacts/contacts_add.html',
    EDIT_CONTACT: '../overlays/contacts/contacts_edit.html',
    SUCCESS_PAGE: '../overlays/contacts/contacts_add_successful.html',
    CONTACTS_LIST: '../overlays/contacts/contacts.html',
    MAIN_PAGE: '../pages/contacts_list.html',
};

// LocalStorage Keys - prevents typos and centralizes key management
export const STORAGE_KEYS = {
    LAST_SAVED_CONTACT: 'lastSavedContact',
    CURRENT_EDIT_ID: 'currentEditContactId'
};

// Firebase Endpoints Structure
export const FIREBASE_PATHS = {
    COUNTER: '/contacts/counter.json',
    CONTACTS_DATA: '/contacts/data.json',
    SINGLE_CONTACT: (id) => `/contacts/data/contact_${id}.json`
};

// Default Values
export const DEFAULTS = {
    START_COUNTER: 1000,
    PERSON_ICON: '../assets/img/icons/form/person.svg'
};