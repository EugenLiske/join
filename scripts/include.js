// 
// main_header.html
// main_navigation.html
// 
// div-container:
//      id: main_header
//      id: navigation_bar
// 

function initNavigation(page){
    includePageNavigation(page);
    includePageHeader();
}

function includePageNavigation(page){
    try{
        fetch('../includes/page_navigation.html')
            .then(response => response.text())
            .then(data => {
                try{
                    document.getElementById("page_navigation").innerHTML = data; 
                    changeActiveNavButton(page);
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

function includePageHeader(){
    try{
        fetch('../includes/page_header.html')
            .then(response => response.text())
            .then(data => {
                try{
                    document.getElementById("page_header").innerHTML = data;
                    const initialsButton = document.getElementById("login_initials");
                    const initials = sessionStorage.getItem("initials");
                    if (initials && initials.trim() !== "") {
                        initialsButton.textContent = initials;
                    } else {
                        initialsButton.textContent = "G";
                    }
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

async function includeAddTaskForm(){
    try{
        await fetch('../includes/add_task_form.html')
            .then(response => response.text())
            .then(data => {
                try{
                    document.getElementById("add_task_form").innerHTML = data; 
                    initAddTask();
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

function changeActiveNavButton(page){
    if (["summary", "add_task", "board", "contacts"].indexOf(page) >= 0){
        toggleNavButtons("content", "footer", page);
    }
    if (["privacy_policy", "legal_notice"].indexOf(page) >= 0){
        toggleNavButtons("footer", "content", page);
    }
    if (["help"].indexOf(page) >= 0){
        deactiveCurrentNavButton("content");
        deactiveCurrentNavButton("footer");
    }
}

function toggleNavButtons(setElement, otherElement, page){
    deactiveCurrentNavButton(otherElement);
    deactiveCurrentNavButton(setElement);
    document.getElementById("nav_" + page).classList.replace("deactive_" + setElement, "active_" + setElement);               
}

function deactiveCurrentNavButton(element){
    document.getElementsByClassName("active_" + element)[0].classList.replace("active_" + element, "deactive_" + element);
}

// Bereinigung des Session Storage, innerhalb dessen die Initialen gespeichert sind

function logoutUser(){
    sessionStorage.clear();
}

