
/**
 * Initializes the full navigation and header for a page.
 * Loads the standard navigation and header components.
 * 
 * @param {string} page - The current page identifier ("summary", "board", "add_task", "contacts", "privacy_policy", "legal_notice", "help").
 */
function initNavigation(page){
    includePageNavigation(page, "page_navigation.html", "all");
    includePageHeader("page_header.html", "all");
}


/**
 * Initializes the limited (external) navigation and header.
 * Used for pages with no login required.
 * 
 * @param {string} page - The current page identifier ("privacy_policy", "legal_notice", "help").
 */
function initNavigationExternal(page){
    includePageNavigation(page, 'page_navigation_external.html', "limited");
    includePageHeader("page_header_external.html", "limited");
}


/**
 * Dynamically loads the navigation HTML and inserts it into the DOM.
 * After loading, activates the correct navigation button based on the current page.
 * 
 * @param {string} page - The current page identifier.
 * @param {string} [navigation="page_navigation.html"] - The HTML file to load for navigation.
 * @param {string} [mode="limited"] - The mode of the navigation ("limited" or "all").
 */
async function includePageNavigation(page, navigation = "page_navigation.html", mode = "limited"){
    try{
        fetch('../includes/' + navigation)
            .then(response => response.text())
            .then(data => {
                try{
                    document.getElementById("page_navigation").innerHTML = data; 
                    changeActiveNavButton(page, mode);
                }
                catch(error){
                    console.warn("HTML container not available!");
                }
            });
    }
    catch(error){
        console.warn("Include page navigation - Error: Navigation is not loaded!!!");
    }
}


/**
 * Dynamically loads the page header HTML and inserts it into the DOM.
 * If mode is not "limited", user initials are also included in the header.
 * 
 * @param {string} header - The header file name to load.
 * @param {string} [mode="limited"] - The header mode ("limited" or "all").
 */
async function includePageHeader(header, mode = "limited"){
    try{
        fetch('../includes/' + header)
            .then(response => response.text())
            .then(data => {
                try{
                    document.getElementById("page_header").innerHTML = data;
                    if (mode !== "limited") includeInitialsToHeader();
                }
                catch(error){
                    console.warn("HTML container not available!");
                }
            });    
    }
    catch(error){
        console.warn("Include page header - Error: Header is not loaded!!!");
    }     
}


/**
 * Inserts the user's initials into the header.
 * Falls back to the letter "G" if no initials are stored.
 */
function includeInitialsToHeader(){
    const initialsButton = document.getElementById("login_initials");
    const initials = sessionStorage.getItem("initials");
    if (initials && initials.trim() !== "") {
        initialsButton.textContent = initials;
    } else {
        initialsButton.textContent = "G";
    }    
}


/**
 * Loads the HTML form for adding or editing a task and inserts it into the specified container.
 * 
 * @param {string} [containerId="add_task_form"] - The ID of the HTML container where the form will be inserted.
 */
async function includeAddTaskForm(containerId = "add_task_form"){
    try{
        await fetch('../includes/add_task_form.html')
            .then(response => response.text())
            .then(data => {
                try{
                    document.getElementById(containerId).innerHTML = data; 
                }
                catch{
                    console.warn("HTML container not available!");
                }
            });    
    }
    catch(error){
        console.warn("Include add task form - Error: Form is not loaded!!!");
    }
}


/**
 * Activates the correct navigation button based on the current page and mode.
 * 
 * @param {string} page - The current page identifier.
 * @param {string} mode - Navigation mode ("limited" or "all").
 */
function changeActiveNavButton(page, mode){
    if (["summary", "add_task", "board", "contacts"].indexOf(page) >= 0){
        toggleNavButtons("content", "footer", page, mode);
    }
    if (["privacy_policy", "legal_notice"].indexOf(page) >= 0){
        toggleNavButtons("footer", "content", page, mode);
    }
    if (["help"].indexOf(page) >= 0){
        if (mode !== "limited") deactiveCurrentNavButton("content");
        deactiveCurrentNavButton("footer");
    }
}


/**
 * Toggles active state of navigation buttons between active and inactive.
 * 
 * @param {string} setElement - The element group to activate ("content" or "footer").
 * @param {string} otherElement - The element group to deactivate.
 * @param {string} page - The current page identifier.
 * @param {string} mode - Navigation mode ("limited" or "all").
 */
function toggleNavButtons(setElement, otherElement, page, mode){
    deactiveCurrentNavButton(setElement);
    if (mode !== "limited") deactiveCurrentNavButton(otherElement);
    document.getElementById("nav_" + page).classList.replace("deactive_" + setElement, "active_" + setElement);               
}


/**
 * Deactivates the currently active navigation button in the specified section.
 * 
 * @param {string} element - The element group to search ("content" or "footer").
 */
function deactiveCurrentNavButton(element){
    document.getElementsByClassName("active_" + element)[0].classList.replace("active_" + element, "deactive_" + element);
}


/**
 * Logs out the current user by clearing all session storage data.
 */
function logoutUser(){
    sessionStorage.clear();
}
