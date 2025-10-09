let login = false;


/**
 * Closes the burger menu when it is open and the user clicks next to the menu.
 */
document.addEventListener('click', event => {
    if (document.getElementById('side_menu').classList.contains('open') && !(event.target.id === "side_menu") && !(event.target.id === "login_initials")){
        document.getElementById('side_menu').classList.remove('open');
    }
})


function toggleMenu() {
    const menu = document.getElementById('side_menu');
    menu.classList.toggle('open');
}


/**
 * Toggles the display of an overlay element by toggling the "d_none" class.
 * 
 * @param {string} htmlId - The html ID of the overlay element.
 */
function toggleOverlay(htmlId){
    const overlay = document.getElementById(htmlId);
    overlay.classList.toggle("d_none");
}


/**
 * Displays an overlay and triggers its entrance animation by applying the "active" class.
 * 
 * @param {string} wrapperId - Html ID of the overlay wrapper element.
 * @param {string} containerId - Html ID of the overlay content container.
 */
function showAnimationOverlay(wrapperId, containerId){
    const overlay = document.getElementById(wrapperId);
    overlay.classList.toggle("d_none");
    const overlayContent = document.getElementById(containerId);
    setTimeout(() => {
        overlay.classList.add('active');
        overlayContent.classList.add('active');    
    }, 50);
}


/**
 * Triggers the exit animation of an overlay and hides it after a delay.
 * 
 * @param {string} wrapperId - Html ID of the overlay wrapper.
 * @param {string} containerId - Html ID of the overlay content container.
 */
function hideAnimationOverlay(wrapperId, containerId){
    const overlay = document.getElementById(wrapperId);
    const overlayContent = document.getElementById(containerId);
    setTimeout(() => {
        overlay.classList.remove('active');
        overlayContent.classList.remove('active');          
    }, 50);
    setTimeout(() => {
        overlay.classList.toggle("d_none");
    }, 1000)
}


/**
 * Removes the "active" class from the overlay and its container to reset their state.
 * 
 * @param {string} wrapperId - Html ID of the overlay wrapper.
 * @param {string} containerId - Html ID of the overlay container.
 */
function resetAnimation(wrapperId, containerId){
    const overlay = document.getElementById(wrapperId);
    const overlayContent = document.getElementById(containerId);
    overlay.classList.remove('active');
    overlayContent.classList.remove('active');       
}


/**
 * Immediately applies the "active" class to an overlay and its container.
 * 
 * @param {string} wrapperId - Html ID of the overlay wrapper.
 * @param {string} containerId - Html ID of the overlay container.
 */
function setAnimtion(wrapperId, containerId){
    const overlay = document.getElementById(wrapperId);
    const overlayContent = document.getElementById(containerId);
    overlay.classList.add('active');
    overlayContent.classList.add('active');       
}


/**
 * Initializes navigation and header elements for internal pages.
 * 
 * @param {string} page - The name of the current page.
 */
function initNavAndHeaderPage(page){
    initNavigation(page);
}


/**
 * Initializes navigation and header elements for external pages.
 * 
 * @param {string} page - The name of the current page.
 */
function initNavAndHeaderPageExternal(page){
    initNavigationExternal(page);
}



/**
 * Searches through an object (keyed by strings) and returns the value 
 * whose key ends with the given ID.
 * 
 * @param {Object} objects - Object containing items as key-value pairs.
 * @param {string} getId - The ID to search for.
 * @returns {Object|number} - The found object, or -1 if not found.
 */
function getElementWithId(objects, getId) {
    if (!objects) return -1;
    const objectKeys = Object.keys(objects);
    for (let keyIdx = 0; keyIdx < objectKeys.length; keyIdx++) {
        if (getId == getIdFromObjectKey(objectKeys[keyIdx])){
            return objects[objectKeys[keyIdx]];
        }
    }

    return -1;
}


/**
 * Searches through an array of objects and returns the one with the matching ID.
 * 
 * @param {Array} objectArray - Array of objects with an "id" property.
 * @param {string} getId - The ID to search for.
 * @returns {Object|number} - The found object, or -1 if not found.
 */
function getElementWithId2(objectArray, getId) {
    if (!objectArray) return -1;
    for (let arrayIdx = 0; arrayIdx < objectArray.length; arrayIdx++) {
        if (getId == objectArray[arrayIdx].id){            
            return objectArray[arrayIdx];
        }
    }
    return -1;
}


/**
 * Extracts the ID from a string by splitting it with "_" and returning the last segment.
 * 
 * @param {string} key - A key string (e.g. "task_123").
 * @returns {string} - The extracted ID (e.g. "123").
 */
function getIdFromObjectKey(key){
    let splitKey = key.split("_");
    return splitKey[splitKey.length - 1];
}


/**
 * Checks if an object was found (not -1) and logs a warning if not.
 * 
 * @param {any} object - The object to check.
 * @returns {boolean} - True if valid, false if not found.
 */
function objectFound(object){
    if (object == -1)
    {
        console.warn("Object doesn't exist!");
        return false;
    }
    return true;
}


/**
 * Converts a date string from "DD/MM/YYYY" to "YYYY-MM-DD".
 * 
 * @param {string} date - Date string in "DD/MM/YYYY" format.
 * @returns {string} - Converted date string in "YYYY-MM-DD" format.
 */
function changeDateFormat(date){
    let splitDate = date.split("/");
    let reverseDate = splitDate.reverse();
    return reverseDate.join("-");
}


/**
 * Converts a date string from "YYYY-MM-DD" to "DD/MM/YYYY".
 * 
 * @param {string} date - Date string in "YYYY-MM-DD" format.
 * @returns {string} - Converted date string in "DD/MM/YYYY" format.
 */
function changeDateFormat2(date){
    const splitDate = date.split("-");
    splitDate.reverse();
    return splitDate.join("/");
}


/**
 * Capitalizes the first letter of a word.
 * 
 * @param {string} word - The word to capitalize.
 * @returns {string} - The word with its first letter in uppercase.
 */
function firstLetterUpperCase(word) {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
}


/**
 * Sets the scroll behavior of the body element.
 * 
 * @param {string} mode - CSS overflow value (e.g., "hidden" or "").
 */
function toggleScrollBehaviorOfBody(mode = ""){
    document.body.style.overflow = mode;
}


/**
 * Displays a toast message overlay and optionally redirects to another page after.
 * 
 * @param {string} overlayId - ID of the toast overlay element.
 * @param {string} messageId - ID of the message element inside the overlay.
 * @param {string} [page=""] - Optional URL to redirect to after the toast disappears.
 */
function displayToastMessage(overlayId, messageId, page = "") {
    const overlayRef = document.getElementById(overlayId);
    const messageRef = document.getElementById(messageId);

    overlayRef.classList.add("active");
    messageRef.classList.add("enter");
    setTimeout(function () {
        overlayRef.classList.remove("active");
        messageRef.classList.remove("enter");
        overlayRef.classList.add("leaving");
        redirectToPageAfterTimeout(page);
    }, 2700);
    overlayRef.classList.remove("leaving");
}


/**
 * Redirects the user to a specified page after a short delay.
 * 
 * @param {string} [page=""] - The URL or path to redirect to. If empty, no redirect occurs.
 */
function redirectToPageAfterTimeout(page = ""){
    if (page !== ""){
        setTimeout(function () {
            window.location.href = page;
        }, 300);        
    }    
}


function setupOverlayOutsideClickClose() {
    wireOverlayBackgroundClose('overlay_task', onTaskOverlayBackgroundClick);
    wireOverlayBackgroundClose('overlay_edit_task', onEditOverlayBackgroundClick);
}


/**
 * Adds a click event to an overlay to trigger a callback when the background is clicked.
 * 
 * @param {string} overlayId - The ID of the overlay element.
 * @param {Function} onBackgroundClick - The callback function to execute.
 */
function wireOverlayBackgroundClose(overlayId, onBackgroundClick) {
    const overlayElement = document.getElementById(overlayId);
    if (!overlayElement) return;

    overlayElement.onclick = function (event) {
    if (event.target === overlayElement) {
        onBackgroundClick();
    }
    };
}


function onTaskOverlayBackgroundClick() {
    saveSubtaskChanges();
    hideAnimationOverlay('overlay_task', 'overlay_task_container');
    toggleScrollBehaviorOfBody('');
}


function onEditOverlayBackgroundClick() {
    hideAnimationOverlay('overlay_edit_task', 'overlay_edit_task_container');
    resetAnimation('overlay_task', 'overlay_task_container');
    toggleScrollBehaviorOfBody('');
}


/**
 * Generates initials from a person's full name.
 * 
 * @param {string} name - Full name of the person.
 * @returns {string} - Uppercase initials (e.g. "John Doe" → "JD").
 */
function generateInitials(name) {
    if (!name || typeof name !== 'string') return '';
    
    const words = name.trim().split(' ').filter(word => word.length > 0);
    if (words.length === 0) return '';
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    
    const firstInitial = words[0].charAt(0);
    const lastInitial = words[words.length - 1].charAt(0);
    return (firstInitial + lastInitial).toUpperCase();
}

