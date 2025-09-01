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
    .then(data => document.getElementById("page_navigation").innerHTML = data);


// Bereinigung des Session Storage, innerhalb dessen die Initialen gespeichert sind

function logoutUser(){
    sessionStorage.clear();
}

