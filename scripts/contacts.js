/**
 * Frontend Input Functions for Contact Management
 * Handles form data collection, validation, and user interactions
 */

import { 
    FIREBASE_URL, 
    AVATAR_COLORS, 
    PAGES, 
    STORAGE_KEYS,
    FIREBASE_PATHS,
    DEFAULTS 
} from './config.js';




// ================== DOM ELEMENT CONSTANTS ==================

// Form Input Elements
const NAME_INPUT = document.getElementById('name_input');
const EMAIL_INPUT = document.getElementById('email_input');
const PHONE_INPUT = document.getElementById('telephone_input');

// Button Elements
const SAVE_BUTTON = document.getElementById('save_button');
const DELETE_BUTTON = document.getElementById('delete_button');
const CLOSE_BUTTON = document.getElementById('close_button');
const BUTTON_TEXT = document.getElementById('button_text');

// Avatar Elements
const CONTACT_AVATAR = document.getElementById('contact_avatar');
const AVATAR_INITIALS = document.getElementById('avatar_initials');

// Success Page Elements (only exist on success page)
const CONTENT_HEAD_NAME = document.getElementById('content_head_name');
const CONTACT_EMAIL_DISPLAY = document.getElementById('contact_email');
const CONTACT_PHONE_DISPLAY = document.getElementById('contact_phone');

// ================== VALIDATION FUNCTIONS ==================

/**
 * Validates email format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates phone format - must start with 0 or +, minimum 6 digits
 * @param {string} phone - Phone number to validate
 * @returns {object} - {isValid: boolean, message: string}
 */
function validatePhone(phone) {
    // Remove all spaces and special characters to count digits
    const digitsOnly = phone.replace(/\D/g, '');
    const hasMinDigits = digitsOnly.length >= 6;
    
    // Must start with 0 or +
    const startsCorrect = /^[0+]/.test(phone.trim());
    
    if (!hasMinDigits) {
        return {
            isValid: false,
            message: 'Phone number must have at least 6 digits'
        };
    }
    
    if (!startsCorrect) {
        return {
            isValid: false,
            message: 'Please enter area code (start with 0 or +)'
        };
    }
    
    // Additional format check: allow digits, spaces, +, -, (), /
    const formatCheck = /^[0+][\d\s\-\(\)\/+]*\d$/.test(phone);
    
    return {
        isValid: formatCheck,
        message: formatCheck ? '' : 'Invalid phone number format'
    };
}

/**
 * Validates name input - must contain at least first and last name
 * @param {string} name - Full name to validate
 * @returns {object} - {isValid: boolean, message: string}
 */
function validateName(name) {
    const trimmedName = name.trim();
    
    if (trimmedName.length === 0) {
        return {
            isValid: false,
            message: 'Name is required'
        };
    }
    
    const words = trimmedName.split(' ').filter(word => word.length > 0);
    
    if (words.length < 2) {
        return {
            isValid: false,
            message: 'Please enter first and last name'
        };
    }
    
    return {
        isValid: true,
        message: ''
    };
}

// ================== INPUT DATA FUNCTIONS ==================

/**
 * Gets all form input values and validates them
 * @returns {object} - Complete form data with validation results
 */
function getFormData() {
    // Get values (with null checks for missing elements)
    const name = NAME_INPUT ? NAME_INPUT.value.trim() : '';
    const email = EMAIL_INPUT ? EMAIL_INPUT.value.trim() : '';
    const phone = PHONE_INPUT ? PHONE_INPUT.value.trim() : '';
    
    // Validate each field
    const nameValidation = validateName(name);
    const emailValidation = {
        isValid: email.length > 0 && validateEmail(email),
        message: email.length === 0 ? 'Email is required' : 
                !validateEmail(email) ? 'Please enter a valid email address' : ''
    };
    const phoneValidation = validatePhone(phone);
    
    return {
        // Raw values
        name: name,
        email: email, 
        phone: phone,
        
        // Validation results
        nameValidation: nameValidation,
        emailValidation: emailValidation,
        phoneValidation: phoneValidation,
        
        // Overall validity
        isValid: nameValidation.isValid && emailValidation.isValid && phoneValidation.isValid,
        
        // Ready-to-save contact object
        contactData: {
            name: name,
            email: email,
            phone: phone
        }
    };
}

/**
 * Generates initials from full name (first + last name only)
 * @param {string} name - Full name
 * @returns {string} - Initials (e.g., "Karl Hans Heinrich Meier" -> "KM")
 */
function generateInitials(name) {
    if (!name || typeof name !== 'string') return '';
    
    const words = name.trim().split(' ').filter(word => word.length > 0);
    if (words.length === 0) return '';
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    
    // First + Last name only
    const firstInitial = words[0].charAt(0);
    const lastInitial = words[words.length - 1].charAt(0);
    return (firstInitial + lastInitial).toUpperCase();
}

// ================== UI UPDATE FUNCTIONS ==================

/**
 * Updates field validation styling based on validation result
 * @param {HTMLElement} inputElement - The input field to style
 * @param {object} validationResult - Result from validation function
 */
function updateFieldValidation(inputElement, validationResult) {
    if (!inputElement) return;
    
    // Remove existing validation classes
    inputElement.style.borderColor = '';
    
    if (validationResult.isValid) {
        inputElement.style.borderColor = 'var(--c-active)'; // Blue for valid
        inputElement.title = ''; // Remove error tooltip
    } else if (inputElement.value.length > 0) {
        inputElement.style.borderColor = 'var(--c-warn)'; // Red for invalid
        inputElement.title = validationResult.message; // Show error in tooltip
    } else {
        inputElement.style.borderColor = 'var(--c-default)'; // Gray for empty
        inputElement.title = '';
    }
}

/**
 * Updates avatar preview with initials from name input
 * @param {string} name - Current name input value
 */
function updateAvatarPreview(name) {
    if (!AVATAR_INITIALS) return;
    
    const initials = generateInitials(name);
    if (initials.length > 0) {
        AVATAR_INITIALS.textContent = initials;
    } else {
        // Show default person icon when no valid name
        AVATAR_INITIALS.innerHTML = '<img src="assets/img/icons/form/person.svg" class="input_field_icon" alt="Person Icon" />';
    }
}

/**
 * Updates save button state based on form validation
 * @param {boolean} isFormValid - Whether the entire form is valid
 */
function updateSaveButtonState(isFormValid) {
    if (!SAVE_BUTTON) return;
    
    SAVE_BUTTON.disabled = !isFormValid;
    
    if (isFormValid) {
        SAVE_BUTTON.classList.remove('disabled');
    } else {
        SAVE_BUTTON.classList.add('disabled');
    }
}

// ================== MAIN FORM VALIDATION ==================

/**
 * Main form validation function - validates entire form and updates UI
 * Called on input events and form submission
 */
function validateContactForm() {
    const formData = getFormData();
    
    // Update individual field styling
    updateFieldValidation(NAME_INPUT, formData.nameValidation);
    updateFieldValidation(EMAIL_INPUT, formData.emailValidation);
    updateFieldValidation(PHONE_INPUT, formData.phoneValidation);
    
    // Update avatar preview
    updateAvatarPreview(formData.name);
    
    // Update save button state
    updateSaveButtonState(formData.isValid);
    
    return formData;
}

// ================== BUTTON ACTIONS ==================

/**
 * Clears all form inputs and resets validation styling
 */
function clearForm() {
    if (NAME_INPUT) {
        NAME_INPUT.value = '';
        NAME_INPUT.style.borderColor = 'var(--c-default)';
        NAME_INPUT.title = '';
    }
    
    if (EMAIL_INPUT) {
        EMAIL_INPUT.value = '';
        EMAIL_INPUT.style.borderColor = 'var(--c-default)';
        EMAIL_INPUT.title = '';
    }
    
    if (PHONE_INPUT) {
        PHONE_INPUT.value = '';
        PHONE_INPUT.style.borderColor = 'var(--c-default)';
        PHONE_INPUT.title = '';
    }
    
    // Reset avatar to default icon
    if (AVATAR_INITIALS) {
        AVATAR_INITIALS.innerHTML = '<img src="assets/img/icons/form/person.svg" class="input_field_icon" alt="Person Icon" />';
    }
    
    // Reset save button
    updateSaveButtonState(false);
    
    console.log('Form cleared');
}

/**
 * Cancel button action - clears form and optionally navigates back
 */
function cancelContactAction() {
    const confirmCancel = confirm('Are you sure you want to cancel? All changes will be lost.');
    
    if (confirmCancel) {
        clearForm();
        // TODO: Add navigation logic here
        console.log('Contact action cancelled');
    }
}

/**
 * Fills form with contact data (for editing)
 * @param {object} contactData - Contact object with name, email, phone
 */
function fillFormWithContactData(contactData) {
    if (!contactData) return;
    
    if (NAME_INPUT && contactData.name) {
        NAME_INPUT.value = contactData.name;
    }
    
    if (EMAIL_INPUT && contactData.email) {
        EMAIL_INPUT.value = contactData.email;
    }
    
    if (PHONE_INPUT && contactData.phone) {
        PHONE_INPUT.value = contactData.phone;
    }
    
    // Update avatar if contact has a color
    if (contactData.avatarColor && CONTACT_AVATAR) {
        CONTACT_AVATAR.style.backgroundColor = contactData.avatarColor;
    }
    
    // Validate the filled form
    validateContactForm();
    
    console.log('Form filled with contact data:', contactData);
}

// ================== SUCCESS PAGE DISPLAY ==================

/**
 * Displays contact information on success page
 * @param {object} contactData - Contact object to display
 */
function displayContactSuccess(contactData) {
    if (!contactData) {
        console.error('No contact data to display');
        return;
    }
    
    // Update name
    if (CONTENT_HEAD_NAME) {
        CONTENT_HEAD_NAME.textContent = contactData.name;
    }
    
    // Update email
    if (CONTACT_EMAIL_DISPLAY) {
        CONTACT_EMAIL_DISPLAY.textContent = contactData.email;
    }
    
    // Update phone
    if (CONTACT_PHONE_DISPLAY) {
        CONTACT_PHONE_DISPLAY.textContent = contactData.phone;
    }
    
    // Update avatar
    if (contactData.avatarColor && CONTACT_AVATAR) {
        CONTACT_AVATAR.style.backgroundColor = contactData.avatarColor;
    }
    
    if (AVATAR_INITIALS) {
        const initials = generateInitials(contactData.name);
        AVATAR_INITIALS.textContent = initials;
    }
    
    console.log('Success page updated with contact data');
}

// ================== EVENT LISTENERS ==================

/**
 * Initialize event listeners when DOM is loaded
 */
function initializeEventListeners() {
    // Input validation on typing
    if (NAME_INPUT) {
        NAME_INPUT.addEventListener('input', validateContactForm);
    }
    
    if (EMAIL_INPUT) {
        EMAIL_INPUT.addEventListener('input', validateContactForm);
    }
    
    if (PHONE_INPUT) {
        PHONE_INPUT.addEventListener('input', validateContactForm);
    }
    
    console.log('Event listeners initialized');
}

// ================== INITIALIZATION ==================

/**
 * Initialize the page when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    
    // Initial form validation
    if (NAME_INPUT || EMAIL_INPUT || PHONE_INPUT) {
        validateContactForm();
    }
    
    console.log('Frontend functions initialized');
});

// ================== EXPORT FUNCTIONS FOR GLOBAL ACCESS ==================

// Make functions available globally for onclick handlers in HTML
window.validateContactForm = validateContactForm;
window.clearForm = clearForm;
window.cancelContactAction = cancelContactAction;
window.getFormData = getFormData;