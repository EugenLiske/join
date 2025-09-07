let currentPage = "summary";
let login = true;

function toggleMenu() {
    const menu = document.getElementById('side_menu');
    menu.classList.toggle('open');
}


function toggleOverlay(htmlId){
    const overlay = document.getElementById(htmlId);
    overlay.classList.toggle("d_none");
}