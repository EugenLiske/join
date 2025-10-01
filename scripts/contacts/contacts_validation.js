// MF - contacts_validation.js

/**
 * Contacts Validation Module
 * All validation logic for contact forms
 */

/**
 * Validates email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid
 */
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates phone number format and requirements
 * @param {string} phone - Phone number to validate
 * @returns {Object} Validation result with isValid boolean and message string
 */
export function validatePhone(phone) {
    const digitsOnly = phone.replace(/\D/g, '');
    const hasMinDigits = digitsOnly.length >= 6;
    const startsCorrect = /^[0+]/.test(phone.trim());
    
    if (!hasMinDigits) {
        return { isValid: false, message: 'Phone number must have at least 6 digits' };
    }
    
    if (!startsCorrect) {
        return { isValid: false, message: 'Please enter area code (start with 0 or +)' };
    }
    
    const formatCheck = /^[0+][\d\s\-\(\)\/+]*\d$/.test(phone);
    return {
        isValid: formatCheck,
        message: formatCheck ? '' : 'Invalid phone number format'
    };
}

/**
 * Validates contact name requirements
 * @param {string} name - Full name to validate
 * @returns {Object} Validation result with isValid boolean and message string
 */
export function validateName(name) {
    const trimmedName = name.trim();
    
    if (trimmedName.length === 0) {
        return { isValid: false, message: 'Name is required' };
    }
    
    const words = trimmedName.split(' ').filter(word => word.length > 0);
    
    if (words.length < 2) {
        return { isValid: false, message: 'Please enter first and last name' };
    }
    
    return { isValid: true, message: '' };
}

/**
 * Collects and validates all form data from DOM inputs
 * @returns {Object} Complete form data with validation results and contact data
 */
export function getFormData() {
    const nameInput = document.getElementById('name_input');
    const emailInput = document.getElementById('email_input');
    const phoneInput = document.getElementById('telephone_input');
    
    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    
    const nameValidation = validateName(name);
    const emailValidation = {
        isValid: email.length > 0 && validateEmail(email),
        message: email.length === 0 ? 'Email is required' : 
                !validateEmail(email) ? 'Please enter a valid email address' : ''
    };
    const phoneValidation = validatePhone(phone);
    
    return {
        name: name,
        email: email, 
        phone: phone,
        nameValidation: nameValidation,
        emailValidation: emailValidation,
        phoneValidation: phoneValidation,
        isValid: nameValidation.isValid && emailValidation.isValid && phoneValidation.isValid,
        contactData: { name: name, email: email, phone: phone }
    };
}

/**
 * Generates initials from full name
 * @param {string} name - Full name to generate initials from
 * @returns {string} Two-character initials in uppercase, or empty string if invalid
 */
export function generateInitials(name) {
    if (!name || typeof name !== 'string') return '';
    
    const words = name.trim().split(' ').filter(word => word.length > 0);
    if (words.length === 0) return '';
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    
    const firstInitial = words[0].charAt(0);
    const lastInitial = words[words.length - 1].charAt(0);
    return (firstInitial + lastInitial).toUpperCase();
}