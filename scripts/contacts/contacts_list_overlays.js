// MF - contacts_list_overlays.js
/**
 * Contacts List - Overlay Management
 * Handles Add/Edit contact overlays
 */

import { FIREBASE_URL, FIREBASE_PATHS, STORAGE_KEYS } from "../config.js";

import {
  loadAllContacts,
  contactsData,
  showToastMessage,
} from "./contacts_list_data.js";
import {
  selectContactById,
  getCurrentSelectedContact,
} from "./contacts_list_selection.js";
import { closeMobileActionMenu } from "./contacts_list_mobile.js";

// ================== DOM ELEMENTS ==================
const contactDetailsPanel = document.getElementById("contact_details_panel");

// ================== OVERLAY LOADING ==================

/**
 * Opens the Add Contact overlay
 */
export async function openAddContactOverlay() {
  try {
    if (document.activeElement) {
          document.activeElement.blur();
      }
    const html = await loadOverlayHTML(
      "../overlays/contacts/contacts_add.html"
    );
    showOverlay("add_contact_overlay", html);

    await loadContactScripts();
    initializeAddContactOverlay();
  } catch (error) {
    // Error handling
  }
}

/**
 * Opens the Edit Contact overlay for selected contact
 */
export async function editSelectedContact() {
  const currentContact = getCurrentSelectedContact();
  if (!currentContact) return;

  try {
    document.body.classList.remove("mobile_view_contact_details");
    localStorage.setItem(STORAGE_KEYS.CURRENT_EDIT_ID, currentContact.id);

    await loadAndShowEditOverlay();
  } catch (error) {
    // Error handling
  }
}

async function loadAndShowEditOverlay() {
  const html = await loadOverlayHTML("../overlays/contacts/contacts_edit.html");
  showOverlay("edit_contact_overlay", html);

  await loadContactScripts();
  initializeEditContactOverlay();
}

async function loadOverlayHTML(path) {
  const response = await fetch(path);
  return await response.text();
}

function showOverlay(overlayId, html) {
  const overlay = document.getElementById(overlayId);
  overlay.innerHTML = html;
  overlay.classList.remove("d_none");
  document.body.style.overflow = "hidden";
}

/**
 * Loads contact scripts dynamically
 */
async function loadContactScripts() {
  return new Promise((resolve) => {
    if (window.saveContact) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "../scripts/contacts/contacts_form_main.js";
    script.type = "module";
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

// ================== DELETE FUNCTIONALITY ==================

/**
 * Deletes the selected contact
 */
export async function deleteSelectedContact() {
  const currentContact = getCurrentSelectedContact();
  if (!currentContact) return;

  try {
    closeMobileActionMenu();

    const response = await fetch(
      `${FIREBASE_URL}${FIREBASE_PATHS.SINGLE_CONTACT(currentContact.id)}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete contact");
    }

    showToastMessage("Contact deleted successfully", "success");

    contactDetailsPanel.classList.add("d_none");

    setTimeout(() => {
      loadAllContacts();
    }, 1000);
  } catch (error) {
    showToastMessage("Error deleting contact. Please try again.", "error");
  }
}

// ================== ADD OVERLAY INITIALIZATION ==================

function initializeAddContactOverlay() {
  setupOverlayCloseHandlers("add_contact_overlay", closeAddContactOverlay);
  setupInputEventListeners();
  wrapSaveContactForAdd();
}

function setupOverlayCloseHandlers(overlayId, closeCallback) {
  const closeBtn = document.querySelector(`#${overlayId} .close_button`);
  if (closeBtn) {
    closeBtn.onclick = closeCallback;
  }

  const overlay = document.getElementById(overlayId);
  overlay.onclick = (e) => {
    if (e.target === overlay) {
      closeCallback();
    }
  };
}

function setupInputEventListeners() {
  setTimeout(() => {
    const nameInput = document.getElementById("name_input");
    const emailInput = document.getElementById("email_input");
    const phoneInput = document.getElementById("telephone_input");

    if (nameInput)
      nameInput.addEventListener("input", window.validateContactForm);
    if (emailInput)
      emailInput.addEventListener("input", window.validateContactForm);
    if (phoneInput)
      phoneInput.addEventListener("input", window.validateContactForm);

    if (window.validateContactForm) {
      window.validateContactForm();
    }
  }, 100);
}

function wrapSaveContactForAdd() {
  const originalSaveContact = window.saveContact;
  window.saveContact = async (event) => {
    const result = await originalSaveContact(event);
    if (result !== false) {
      handleSuccessfulContactAdd();
    }
    return result;
  };
}

async function handleSuccessfulContactAdd() {
  closeAddContactOverlay();
  showToastMessage("Contact created successfully", "success");

  setTimeout(async () => {
    await loadAllContacts();
    selectNewestContact();
  }, 1000);
}

function selectNewestContact() {
  const allContacts = Object.values(contactsData).filter((c) => c && c.id);
  const newestContact = allContacts.reduce((prev, current) => {
    return prev.id > current.id ? prev : current;
  });

  if (newestContact) {
    selectContactById(newestContact.id);
  }
}

function closeAddContactOverlay() {
  const overlay = document.getElementById("add_contact_overlay");
  overlay.classList.add("d_none");
  overlay.innerHTML = "";
}

// ================== EDIT OVERLAY INITIALIZATION ==================

function initializeEditContactOverlay() {
  setupOverlayCloseHandlers("edit_contact_overlay", closeEditContactOverlay);
  populateEditForm();
  setupEditInputEventListeners();
  wrapSaveContactForEdit();
}

function populateEditForm() {
    const currentContact = getCurrentSelectedContact();
    if (!currentContact) {
        return;
    }
    
    setTimeout(() => {
        fillFormInputs(currentContact);
        
        const contactAvatar = document.getElementById('contact_avatar');
        if (contactAvatar && currentContact.avatarColor) {
            contactAvatar.style.backgroundColor = currentContact.avatarColor;
        }
        
        if (window.validateContactForm) {
            window.validateContactForm();
        }
    }, 200);
}

function fillFormInputs(contact) {
    const nameInput = document.getElementById('name_input');
    const emailInput = document.getElementById('email_input');
    const phoneInput = document.getElementById('telephone_input');
    if (nameInput) nameInput.value = contact.name || '';
    if (emailInput) emailInput.value = contact.email || '';
    if (phoneInput) phoneInput.value = contact.phone || '';
}

function setupEditInputEventListeners() {
  setTimeout(() => {
    const nameInput = document.getElementById("name_input");
    const emailInput = document.getElementById("email_input");
    const phoneInput = document.getElementById("telephone_input");

    if (nameInput)
      nameInput.addEventListener("input", window.validateContactForm);
    if (emailInput)
      emailInput.addEventListener("input", window.validateContactForm);
    if (phoneInput)
      phoneInput.addEventListener("input", window.validateContactForm);

    if (window.validateContactForm) {
      window.validateContactForm();
    }
  }, 200);
}

function wrapSaveContactForEdit() {
  const currentContact = getCurrentSelectedContact();
  const originalSaveContact = window.saveContact;

  window.saveContact = async (event) => {
    const editedContactId = currentContact?.id;
    const result = await executeSaveContact(originalSaveContact, event);

    if (result === true) {
      handleSuccessfulContactEdit(editedContactId);
    }

    return result;
  };
}

async function executeSaveContact(originalSaveContact, event) {
  try {
    return await originalSaveContact(event);
  } catch (error) {
    return false;
  }
}

function handleSuccessfulContactEdit(editedContactId) {
  closeEditContactOverlay();
  showToastMessage("Contact updated successfully", "success");

  setTimeout(async () => {
    await loadAllContacts();
    if (editedContactId) {
      selectContactById(editedContactId);
    }
  }, 1000);
}

function closeEditContactOverlay() {
  const overlay = document.getElementById("edit_contact_overlay");
  overlay.classList.add("d_none");
  overlay.innerHTML = "";
  document.body.style.overflow = ''
  localStorage.removeItem(STORAGE_KEYS.CURRENT_EDIT_ID);

  closeMobileActionMenu();

  const currentContact = getCurrentSelectedContact();
  if (window.innerWidth <= 600 && currentContact) {
    setTimeout(() => {
      document.body.classList.add("mobile_view_contact_details");
    }, 100);
  }
}
