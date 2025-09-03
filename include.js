// 
// main_header.html
// main_navigation.html
// 
// div-container:
//      id: main_header
//      id: navigation_bar
// 

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

try{
    fetch('../includes/page_navigation.html')
        .then(response => response.text())
        .then(data => {
            try{
                document.getElementById("page_navigation").innerHTML = data; 
                changeActiveNavButton();
            }
            catch(error){
                console.warn("HTML container not available!");
            }
        });
}
catch(error){
    console.warn("Include page navigation - Error: Navigation is not loaded!!!");
}

try{
    fetch('../includes/add_task_form.html')
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


function changeActiveNavButton(){
    if (["summary", "add_task", "board", "contacts"].indexOf(currentPage) >= 0){
        document.getElementsByClassName("active_footer")[0].classList.replace("active_footer", "deactive_footer");

        document.getElementsByClassName("active_content")[0].classList.replace("active_content", "deactive_content");
        document.getElementById("nav_" + currentPage).classList.replace("deactive_content", "active_content");        
    }
    if (["privacy_policy", "legal_notice"].indexOf(currentPage) >= 0){
        document.getElementsByClassName("active_content")[0].classList.replace("active_content", "deactive_content");

        document.getElementsByClassName("active_footer")[0].classList.replace("active_footer", "deactive_footer");
        document.getElementById("nav_" + currentPage).classList.replace("deactive_footer", "active_footer");               
    }
}
// Bereinigung des Session Storage, innerhalb dessen die Initialen gespeichert sind

function logoutUser(){
    sessionStorage.clear();
}

