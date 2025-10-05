// search function

function onSearchInput() {
    updateHTML();
    updateSearchErrorMessage();
}


function getSearchTermFromInput() {
    const searchInputElement = document.getElementById('searchInput');
    if (!searchInputElement) {
        return '';
    }
    const rawValue = searchInputElement.value;
    if (typeof rawValue !== 'string') {
        return '';
    }
    return rawValue.trim().toLowerCase();
}


function getNormalizedSearchTerm() {
    const term = getSearchTermFromInput();
    if (typeof term === 'string') {
        return term.trim().toLowerCase();
    }
    return '';
}


function getNormalizedTextOrEmpty(value) {
    if (typeof value === 'string') {
        return value.toLowerCase();
    }
    return '';
}


function textMatchesSearchTerm(text, searchTerm) {
    return text.includes(searchTerm);
}


function doesTitleMatchSearchTerm(task) {
    const searchTerm = getNormalizedSearchTerm();
    if (searchTerm.length === 0) return true;
    const normalizedTitle = getNormalizedTextOrEmpty(task.title);
    const normalizedDescription = getNormalizedTextOrEmpty(task.description);
    return textMatchesSearchTerm(normalizedTitle, searchTerm)
        || textMatchesSearchTerm(normalizedDescription, searchTerm);
}


// Error message below the search field

function getSearchErrorElement() {
    return document.getElementById('search_error');
}


function hasSearchTerm() {
    return getSearchTermFromInput().length > 0;
}


function shouldShowSearchError() {
    if (!hasSearchTerm()) return false;
    for (let taskIndex = 0; taskIndex < allTasks.length; taskIndex++) {
        if (doesTitleMatchSearchTerm(allTasks[taskIndex])) return false;
    }
    return true;
}


function toggleSearchErrorVisibility(shouldShow) {
    const errorElement = getSearchErrorElement();
    if (!errorElement) return;
    errorElement.style.display = shouldShow ? 'block' : 'none';
}


function updateSearchErrorMessage() {
    const errorElement = getSearchErrorElement();
    if (!errorElement) return;
    toggleSearchErrorVisibility(shouldShowSearchError());
}


function getBoardAllTasks(){
    return allTasks;
}


function updateTask(taskId, update) {
    const taskIdx = allTasks.findIndex(task => task.id === taskId);
    if (taskIdx !== -1) {        
        allTasks[taskIdx] = { ...allTasks[taskIdx], ...update };
    }
}


function updateTaskCardAtBoard(taskId) {
    const taskIdx = allTasks.findIndex(task => task.id === taskId);
    const taskCard = document.getElementById("task_card_" + taskId);
    if (taskCard && taskIdx !== -1) {
        taskCard.outerHTML = getTaskCardTemplate(allTasks[taskIdx]);
        setCardsDraggableState();
        updateAllOverflowHints();
    }
}


function openDragAndDropMenu(event, taskId){
    event.stopPropagation();
    document.getElementById("drag_and_drop_menu_" + taskId).classList.remove("d_none");
}


function moveTaskWithMenu(event, kanbanBoardColumn, taskId){
    event.stopPropagation();
    currentDraggedTask = taskId;
    moveToDifferentCategory(kanbanBoardColumn);
}


document.addEventListener('click', function(event) {
    closeDragAndDropMenuSelection(event);
});


function closeDragAndDropMenuSelection(event){
    const menuContainers = document.getElementsByClassName('drag_and_drop_menu_mobile');
    if (menuContainers){
        for (let i = 0; i < menuContainers.length; i++) {
            if (menuContainers[i] && !menuContainers[i].contains(event.target) && !menuContainers[i].classList.contains('d_none')) {
                menuContainers[i].classList.add('d_none');
            }
        }        
    }
}


// Display of the arrow to imply scrolling at 320 pixels and more than one task in a row

function getBoardColumnsList() {                 
    return ['to_do', 'in_progress', 'await_feedback', 'done'];  
}   


function hasHorizontalOverflow(el) {
    if (!el) { return false; }                         
    let cards = el.getElementsByClassName('board_card');
    if (cards.length <= 1) { return false; }       
    return el.scrollWidth > el.clientWidth + 1;      
}


function isAtRightEnd(el) {
    return (el.scrollLeft + el.clientWidth) >= (el.scrollWidth - 1);
}


function setOverflowClasses(el) {
    el.classList.add('has-overflow');
    if (isAtRightEnd(el)) {
        el.classList.add('at-end');
    } else {
        el.classList.remove('at-end');
    }
}


function clearOverflowClasses(el) {
    el.classList.remove('has-overflow');
    el.classList.remove('at-end');
}


function updateOverflowHintFor(columnId) {
    const el = document.getElementById(columnId);
    if (!el) { return; }
    if (hasHorizontalOverflow(el)) {
        setOverflowClasses(el);
        el.onscroll = function () { setOverflowClasses(el); };
    } else {
        clearOverflowClasses(el);
        el.onscroll = null;
    }
}   
                                            

function updateAllOverflowHints() {               
    let cols = getBoardColumnsList();             
    for (let i = 0; i < cols.length; i++) {       
        updateOverflowHintFor(cols[i]);           
    }                                             
}