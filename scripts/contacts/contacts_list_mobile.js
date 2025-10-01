// MF - contacts_list_mobile.js
/**
 * Contacts List - Mobile Features
 * Mobile-specific UI interactions
 */

import { getCurrentSelectedContact } from './contacts_list_selection.js';

// ================== MOBILE ACTION MENU ==================

/**
 * Toggles the mobile action menu
 */
export function toggleMobileActionMenu() {
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
export function closeMobileActionMenu() {
    const menu = document.getElementById('mobile_action_menu');
    const overlay = document.getElementById('mobile_menu_overlay');
    
    if (menu && overlay) {
        menu.classList.remove('show');
        setTimeout(() => {
            overlay.classList.remove('show');
        }, 300);
    }
}

// ================== RESPONSIVE HANDLING ==================

/**
 * Initializes mobile resize handler
 */
export function initializeMobileResizeHandler() {
    window.addEventListener('resize', handleResize);
}

function handleResize() {
    const currentContact = getCurrentSelectedContact();
    
    if (window.innerWidth <= 600) {
        if (!currentContact) {
            document.body.classList.remove('mobile_view_contact_details');
        }
    } else {
        document.body.classList.remove('mobile_view_contact_details');
    }
}