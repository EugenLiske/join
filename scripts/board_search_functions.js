// search function

/**
 * Handles input changes in the search field:
 * Rebuilds the board and updates the “no results” error visibility.
 * @returns {void}
 */
function onSearchInput() {
    updateHTML();
    updateSearchErrorMessage();
}

/**
 * Reads the current raw value from the search input.
 * @returns {string} The trimmed, lowercased search term or empty string if unavailable.
 */
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

/**
 * Returns a normalized (trimmed, lowercased) search term.
 * @returns {string} The normalized search term; empty string if not present.
 */
function getNormalizedSearchTerm() {
    const term = getSearchTermFromInput();
    if (typeof term === 'string') {
        return term.trim().toLowerCase();
    }
    return '';
}

/**
 * Normalizes a text value for text search, returning empty string for non-strings.
 * @param {any} value - Value to normalize.
 * @returns {string} Lowercased text or empty string.
 */
function getNormalizedTextOrEmpty(value) {
    if (typeof value === 'string') {
        return value.toLowerCase();
    }
    return '';
}

/**
 * Performs a simple “includes” search.
 * @param {string} text - The normalized haystack.
 * @param {string} searchTerm - The normalized needle.
 * @returns {boolean} True if {@link searchTerm} occurs in {@link text}.
 */
function textMatchesSearchTerm(text, searchTerm) {
    return text.includes(searchTerm);
}

/**
 * Checks whether a task's title or description matches the current search term.
 * Empty search terms match all tasks.
 * @param {{title?: string, description?: string}} task - Task object to test.
 * @returns {boolean} True if the task matches the search; otherwise false.
 */
function doesTitleMatchSearchTerm(task) {
    const searchTerm = getNormalizedSearchTerm();
    if (searchTerm.length === 0) return true;
    const normalizedTitle = getNormalizedTextOrEmpty(task.title);
    const normalizedDescription = getNormalizedTextOrEmpty(task.description);
    return textMatchesSearchTerm(normalizedTitle, searchTerm)
        || textMatchesSearchTerm(normalizedDescription, searchTerm);
}


// Error message below the search field

/**
 * Returns the element that displays the search error.
 * @returns {HTMLElement|null} The error element or null if not found.
 */
function getSearchErrorElement() {
    return document.getElementById('search_error');
}

/**
 * Indicates whether any search term has been entered.
 * @returns {boolean} True if a non-empty search term exists; otherwise false.
 */
function hasSearchTerm() {
    return getSearchTermFromInput().length > 0;
}

/**
 * Decides if the “no results” error should be shown for the current term and task list.
 * @returns {boolean} True if there is a term and no tasks match; otherwise false.
 */
function shouldShowSearchError() {
    if (!hasSearchTerm()) return false;
    for (let taskIndex = 0; taskIndex < allTasks.length; taskIndex++) {
        if (doesTitleMatchSearchTerm(allTasks[taskIndex])) return false;
    }
    return true;
}

/**
 * Shows or hides the search error element.
 * @param {boolean} shouldShow - True to display the error; false to hide it.
 * @returns {void}
 */
function toggleSearchErrorVisibility(shouldShow) {
    const errorElement = getSearchErrorElement();
    if (!errorElement) return;
    errorElement.style.display = shouldShow ? 'block' : 'none';
}

/**
 * Computes and applies the correct visibility state for the search error.
 * @returns {void}
 */
function updateSearchErrorMessage() {
    const errorElement = getSearchErrorElement();
    if (!errorElement) return;
    toggleSearchErrorVisibility(shouldShowSearchError());
}

/**
 * Exposes the in-memory list of all board tasks.
 * @returns {Array<{id: number|string, [key: string]: any}>} The task array.
 */
function getBoardAllTasks(){
    return allTasks;
}

/**
 * Updates a task in-memory by merging the provided partial object.
 * @param {number|string} taskId - The id of the task to update.
 * @param {Partial<{title: string, description: string, kanbanBoardColumn: string, [key: string]: any}>} update - Fields to merge into the task.
 * @returns {void}
 */
function updateTask(taskId, update) {
    const taskIdx = allTasks.findIndex(task => task.id === taskId);
    if (taskIdx !== -1) {        
        allTasks[taskIdx] = { ...allTasks[taskIdx], ...update };
    }
}

/**
 * Re-renders a specific task card on the board after it changed.
 * Keeps DnD state and overflow hints up to date.
 * @param {number|string} taskId - The id of the task to refresh.
 * @returns {void}
 */
function updateTaskCardAtBoard(taskId) {
    const taskIdx = allTasks.findIndex(task => task.id === taskId);
    const taskCard = document.getElementById("task_card_" + taskId);
    if (taskCard && taskIdx !== -1) {
        taskCard.outerHTML = getTaskCardTemplate(allTasks[taskIdx]);
        setCardsDraggableState();
        updateAllOverflowHints();
    }
}

/**
 * Opens the mobile drag & drop menu for a specific task.
 * @param {MouseEvent} event - The click/tap event.
 * @param {number|string} taskId - Task id whose menu should be opened.
 * @returns {void}
 */
function openDragAndDropMenu(event, taskId){
    event.stopPropagation();
    document.getElementById("drag_and_drop_menu_" + taskId).classList.remove("d_none");
}

/**
 * Moves a task using the mobile DnD menu and forwards to the standard move logic.
 * @param {MouseEvent} event - The originating click/tap event.
 * @param {'to_do'|'in_progress'|'await_feedback'|'done'} kanbanBoardColumn - Target column.
 * @param {number|string} taskId - The id of the task to move.
 * @returns {void}
 */
function moveTaskWithMenu(event, kanbanBoardColumn, taskId){
    event.stopPropagation();
    currentDraggedTask = taskId;
    moveToDifferentCategory(kanbanBoardColumn);
}

/**
 * Global click handler to close any open mobile DnD menus when clicking outside.
 * @param {MouseEvent} event - The click event.
 * @returns {void}
 */
document.addEventListener('click', function(event) {
    closeDragAndDropMenuSelection(event);
});

/**
 * Closes any open mobile DnD menu if the click happened outside the menu container.
 * @param {MouseEvent} event - The click event used to test containment.
 * @returns {void}
 */
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

/**
 * Returns the canonical list of board column ids.
 * @returns {Array<'to_do'|'in_progress'|'await_feedback'|'done'>} Column id list.
 */
function getBoardColumnsList() {                 
    return ['to_do', 'in_progress', 'await_feedback', 'done'];  
}   

/**
 * Checks if a column has horizontal overflow (multiple cards on one row).
 * @param {HTMLElement|null} el - The column content element.
 * @returns {boolean} True if horizontally scrollable with >1 card; otherwise false.
 */
function hasHorizontalOverflow(el) {
    if (!el) { return false; }                         
    let cards = el.getElementsByClassName('board_card');
    if (cards.length <= 1) { return false; }       
    return el.scrollWidth > el.clientWidth + 1;      
}

/**
 * Determines whether the column is scrolled to the far right.
 * @param {HTMLElement} el - The column content element.
 * @returns {boolean} True if the scrollbar is at (or extremely near) the right end.
 */
function isAtRightEnd(el) {
    return (el.scrollLeft + el.clientWidth) >= (el.scrollWidth - 1);
}

/**
 * Applies CSS classes that indicate overflow and whether the user is at the right end.
 * @param {HTMLElement} el - The column content element.
 * @returns {void}
 */
function setOverflowClasses(el) {
    el.classList.add('has-overflow');
    if (isAtRightEnd(el)) {
        el.classList.add('at-end');
    } else {
        el.classList.remove('at-end');
    }
}

/**
 * Clears any overflow hint classes from a column.
 * @param {HTMLElement} el - The column content element.
 * @returns {void}
 */
function clearOverflowClasses(el) {
    el.classList.remove('has-overflow');
    el.classList.remove('at-end');
}

/**
 * Computes and applies overflow hints for a single column.
 * @param {'to_do'|'in_progress'|'await_feedback'|'done'} columnId - The id of the column content element.
 * @returns {void}
 */
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
                                            
/**
 * Updates overflow hints for all columns on the board.
 * @returns {void}
 */
function updateAllOverflowHints() {               
    let cols = getBoardColumnsList();             
    for (let i = 0; i < cols.length; i++) {       
        updateOverflowHintFor(cols[i]);           
    }                                             
}
