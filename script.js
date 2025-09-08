let login = true;   //for mobile view

function toggleMenu() {
    const menu = document.getElementById('side_menu');
    menu.classList.toggle('open');
}


function toggleOverlay(htmlId){
    const overlay = document.getElementById(htmlId);
    overlay.classList.toggle("d_none");
}

function initNavAndHeaderPage(page){
    initNavigation(page);
}

function initNavAndHeaderPageExternal(page){
    initNavigationExternal(page);
}

