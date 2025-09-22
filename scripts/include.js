
function initNavigation(page){
    includePageNavigation(page, "page_navigation.html", "all");
    includePageHeader("page_header.html", "all");
}


function initNavigationExternal(page){
    includePageNavigation(page, 'page_navigation_external.html', "limited");
    includePageHeader("page_header_external.html", "limited");
}


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


function includeInitialsToHeader(){
    const initialsButton = document.getElementById("login_initials");
    const initials = sessionStorage.getItem("initials");
    if (initials && initials.trim() !== "") {
        initialsButton.textContent = initials;
    } else {
        initialsButton.textContent = "G";
    }    
}


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


function toggleNavButtons(setElement, otherElement, page, mode){
    deactiveCurrentNavButton(setElement);
    if (mode !== "limited") deactiveCurrentNavButton(otherElement);
    document.getElementById("nav_" + page).classList.replace("deactive_" + setElement, "active_" + setElement);               
}


function deactiveCurrentNavButton(element){
    document.getElementsByClassName("active_" + element)[0].classList.replace("active_" + element, "deactive_" + element);
}


// Bereinigung des Session Storage, innerhalb dessen die Initialen gespeichert sind

function logoutUser(){
    sessionStorage.clear();
}
