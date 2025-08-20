// 
// main_header.html
// main_navigation.html
// 
// div-container:
//      id: main_header
//      id: navigation_bar
// 

fetch('./includes/page_header.html')
    .then(response => response.text())
    .then(data => document.getElementById("page_header").innerHTML = data);

fetch('./includes/page_navigation.html')
    .then(response => response.text())
    .then(data => document.getElementById("page_navigation").innerHTML = data);

