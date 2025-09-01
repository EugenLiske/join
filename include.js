// 
// main_header.html
// main_navigation.html
// 
// div-container:
//      id: main_header
//      id: navigation_bar
// 

// fetch('./includes/page_header.html')
//     .then(response => response.text())
//     .then(data => document.getElementById("page_header").innerHTML = data);

fetch('./includes/page_header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById("page_header").innerHTML = data;
    const initialsButton = document.getElementById("login_initials");
    const initials = sessionStorage.getItem("initials");
    if (initials && initials.trim() !== "") {
      initialsButton.textContent = initials;
    } else {
      initialsButton.textContent = "";
    }
  })
  .catch(error => {
    console.error("Header include failed:", error);
  });


fetch('./includes/page_navigation.html')
    .then(response => response.text())
    .then(data => {document.getElementById("page_navigation").innerHTML = data; changeActiveNavButton();});

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

