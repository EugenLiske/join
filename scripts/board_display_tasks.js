/** @type {{id?: number|string, kanbanBoardColumn?: string, [key: string]: any} | null} Holds the task currently opened/selected on the board. */
let currentTask = null;

/**
 * Sets the globally tracked current task by id.
 * @param {number|string} taskId - The id of the task that should become the current one.
 * @returns {void}
 */
function setCurrentTask(taskId){
    currentTask = getElementWithId2(allTasks, taskId);
}

/**
 * Gets the globally tracked current task.
 * @returns {{id?: number|string, kanbanBoardColumn?: string, [key: string]: any} | null} The currently selected task or null.
 */
function getCurrentTask(){
    return currentTask;
}

/** @type {Array<{id?: number|string, [key: string]: any}> | null} Cached list of contacts relevant for board rendering/assignment. */
let boardContacts = null;

/**
 * Returns the cached board contacts.
 * @returns {Array<{id?: number|string, [key: string]: any}> | null} The contact list or null if not loaded yet.
 */
function getBoardContacts(){
    return boardContacts;
}


// Allows focus of the input field when clicking on the magnifying glass despite absolute positioning and pointer-events:auto

/**
 * Focuses the board search input programmatically.
 * Useful because the search icon is positioned absolutely.
 * @returns {void}
 */
function focusSearchInputField() {
    let searchInput = document.getElementById('searchInput');
    searchInput.focus();
}


// Drag & drop mechanism - Deactivation on mobile devices

/**
 * Detects whether the primary pointer is coarse (e.g., touch screens).
 * @returns {boolean} True if the device likely uses a coarse pointer; otherwise false.
 */
function hasCoarsePointer() {
    if (typeof window === 'undefined') {
        return false;
    }
    if (typeof window.matchMedia === 'function') {
        try {
            return window.matchMedia('(pointer: coarse)').matches;
        } catch (_) {
        }
    }
    return (navigator.maxTouchPoints > 0) || ('ontouchstart' in window);
}

/**
 * Determines whether drag & drop should be active based on input capabilities.
 * @returns {boolean} True if drag & drop is enabled; false for coarse pointer devices.
 */
function isDragDropActive() {
    if (typeof window === 'undefined') {
        return true;
    }
    return !hasCoarsePointer();
}

/**
 * Sets or removes the `draggable` attribute on all board cards depending on capability.
 * @returns {void}
 */
function setCardsDraggableState() {
    let cards = document.getElementsByClassName('board_card');
    let draggableValue = 'false';
    if (isDragDropActive()) {
        draggableValue = 'true';
    }
    for (let i = 0; i < cards.length; i++) {
        cards[i].setAttribute('draggable', draggableValue);
    }
}

/**
 * Removes any visible drop indicators from all board columns.
 * @returns {void}
 */
function clearAllDropIndicators() {
    let columns = ['to_do', 'in_progress', 'await_feedback', 'done'];
    for ( i = 0; i < columns.length; i++) {
        let container = document.getElementById(columns[i]);
        if (container) {
            let indicator = container.querySelector('.drop_indicator');
            if (indicator) {
                indicator.remove();
            }
        }
    }
}

/**
 * Window resize handler to keep DnD state and overflow hints in sync.
 * @returns {void}
 */
window.onresize = function () {
    setCardsDraggableState();
    if (!isDragDropActive()) {
        clearAllDropIndicators();
        updateAllOverflowHints();
    }
};


// Drag & drop mechanism

/** @type {Array<{id: number|string, kanbanBoardColumn: 'to_do'|'in_progress'|'await_feedback'|'done', title?: string, description?: string, [key: string]: any}>} In-memory list of all tasks displayed on the board. */
let allTasks = [];

/**
 * Loads tasks from the database into memory.
 * Expects a JSON object at "/tasks" whose values are individual task objects.
 * @async
 * @returns {Promise<void>} Resolves after all tasks have been pushed to {@link allTasks}.
 */
async function loadTasksFromDB(){
    let taskResponse = await getData("/tasks");
    let taskKeysArray = Object.keys(taskResponse);
    for (let index = 0; index < taskKeysArray.length; index++) {
        allTasks.push(
            taskResponse[taskKeysArray[index]]
        )  
    }
}

/** @type {number|string|undefined} The id of the task currently being dragged (during DnD). */
let currentDraggedTask;

/**
 * Initializes the board page: navigation/header, contacts, tasks, and UI synchronizations.
 * @async
 * @returns {Promise<void>} Resolves when the board page has been fully prepared.
 */
async function initBoardPage() {
    initNavAndHeaderPage('board');
    boardContacts = await getContacts();
    await loadTasksFromDB();
    updateHTML();
    setCardsDraggableState();
    updateAllOverflowHints();
    setupOverlayOutsideClickClose();      
}

/**
 * Rebuilds the board columns from {@link allTasks} and re-applies behaviors.
 * @returns {void}
 */
function updateHTML(){
    generateTasksToDoHTML();
    generateTasksInProgressHTML();
    generateTasksAwaitFeedbackHTML();
    generateTasksDoneHTML();
    setCardsDraggableState();
    updateAllOverflowHints();
}

/**
 * Renders the "To do" column based on filters and search term.
 * @returns {void}
 */
function generateTasksToDoHTML(){
    let tasksToDo = allTasks.filter(task => task['kanbanBoardColumn'] == 'to_do' && doesTitleMatchSearchTerm(task));
    const toDoColumn = document.getElementById('to_do');
    toDoColumn.innerHTML = '';
    if (tasksToDo.length === 0) {
        toDoColumn.innerHTML = generatePlaceholderHTML('to_do');
    } else {
        for (let index = 0; index < tasksToDo.length; index++) {
            const singleTaskToDo = tasksToDo[index];
            toDoColumn.innerHTML += getTaskCardTemplate(singleTaskToDo);
        }
    }
}

/**
 * Renders the "In progress" column based on filters and search term.
 * @returns {void}
 */
function generateTasksInProgressHTML(){
    let tasksInProgress = allTasks.filter(task => task['kanbanBoardColumn'] == 'in_progress' && doesTitleMatchSearchTerm(task));
    const inProgressColumn = document.getElementById('in_progress');
    inProgressColumn.innerHTML = '';
    if (tasksInProgress.length === 0) {
        inProgressColumn.innerHTML = generatePlaceholderHTML('in_progress');
    } else {
        for (let index = 0; index < tasksInProgress.length; index++) {
            const singleTaskInProgress = tasksInProgress[index];
            inProgressColumn.innerHTML += getTaskCardTemplate(singleTaskInProgress);
        }
    }
}

/**
 * Renders the "Await feedback" column based on filters and search term.
 * @returns {void}
 */
function generateTasksAwaitFeedbackHTML(){
    let tasksAwaitFeedback = allTasks.filter(task => task['kanbanBoardColumn'] == 'await_feedback' && doesTitleMatchSearchTerm(task));
    const awaitFeedbackColumn = document.getElementById('await_feedback');
    awaitFeedbackColumn.innerHTML = '';
    if (tasksAwaitFeedback.length === 0) {
        awaitFeedbackColumn.innerHTML = generatePlaceholderHTML('await_feedback');
    } else {
        for (let index = 0; index < tasksAwaitFeedback.length; index++) {
            const singleTaskAwaitFeedback = tasksAwaitFeedback[index];
            awaitFeedbackColumn.innerHTML += getTaskCardTemplate(singleTaskAwaitFeedback);
        }
    }
}

/**
 * Renders the "Done" column based on filters and search term.
 * @returns {void}
 */
function generateTasksDoneHTML(){
    let tasksDone = allTasks.filter(task => task['kanbanBoardColumn'] == 'done' && doesTitleMatchSearchTerm(task));
    const doneColumn = document.getElementById('done');
    doneColumn.innerHTML = '';
    if (tasksDone.length === 0) {
        doneColumn.innerHTML = generatePlaceholderHTML('done');
    } else {
        for (let index = 0; index < tasksDone.length; index++) {
            const singleTaskDone = tasksDone[index];
            doneColumn.innerHTML += getTaskCardTemplate(singleTaskDone);
        }
    }
}

/**
 * Generates the placeholder markup for an empty column.
 * @param {'to_do'|'in_progress'|'await_feedback'|'done'} kanbanBoardColumn - Column identifier.
 * @returns {string} HTML string for the placeholder.
 */
function generatePlaceholderHTML(kanbanBoardColumn) {
    const texts = {
        'to_do': 'No tasks to do',
        'in_progress': 'No tasks in progress',
        'await_feedback': 'No tasks await feedback',
        'done': 'No tasks done'
    };
    return `
        <div class="no_tasks_placeholder">
            ${texts[kanbanBoardColumn]}
        </div>
    `;
}

/**
 * Drag target handler: allows drop if drag & drop is active.
 * @param {DragEvent} event - The dragover event.
 * @returns {void}
 */
function allowDrop(event) {
    if (!isDragDropActive()) { return; } 
    event.preventDefault();
}

/**
 * Drag start handler for a board card.
 * @param {number|string} id - The id of the task being dragged.
 * @param {DragEvent} event - The dragstart event.
 * @returns {void}
 */
function startDragging(id, event){
    if (!isDragDropActive()) { return; } 
    currentDraggedTask = id;
    event.target.classList.add('dragging');
    document.querySelectorAll('.task_column_content').forEach(el => el.classList.add('drag-target-active'));
}

/**
 * Drag end handler for a board card.
 * @param {DragEvent} event - The dragend event.
 * @returns {void}
 */
function endDragging(event){
    if (!isDragDropActive()) { return; } 
    event.target.classList.remove('dragging');
    currentDraggedTask = null;
    document.querySelectorAll('.task_column_content').forEach(el => el.classList.remove('drag-target-active'));
    clearAllDropIndicators();
}

/**
 * Moves the currently dragged task to a different kanban column and persists it.
 * @async
 * @param {'to_do'|'in_progress'|'await_feedback'|'done'} kanbanBoardColumn - Target column identifier.
 * @returns {Promise<void>} Resolves when the update has been saved and the UI refreshed.
 */
async function moveToDifferentCategory(kanbanBoardColumn){
    const actualIndex = allTasks.findIndex(task => task.id === currentDraggedTask);
    if (actualIndex === -1) return; 
    allTasks[actualIndex]['kanbanBoardColumn'] = kanbanBoardColumn;
    updateHTML();
    console.log(allTasks);
    let newKanbanColumn = allTasks[actualIndex]['kanbanBoardColumn'];
    console.log(newKanbanColumn);
    let path = `/tasks/task_${currentDraggedTask}/kanbanBoardColumn`
    console.log(path);
    await setData(newKanbanColumn, path);
}

/**
 * Shows a visual drop indicator inside the specified column (if origin differs).
 * @param {'to_do'|'in_progress'|'await_feedback'|'done'} columnId - Target column id.
 * @returns {void}
 */
function showDropIndicator(columnId) {
    if (!isDragDropActive()) { return; }
    const container = document.getElementById(columnId);
    const actualIndex = allTasks.findIndex(task => task.id === currentDraggedTask);
    if (actualIndex === -1) return; 
    const originCategory = allTasks[actualIndex]['kanbanBoardColumn'];
    if (originCategory === columnId) {
        hideDropIndicator(columnId);
        return;
    }
    if (!container.querySelector('.drop_indicator')) {
        const indicator = document.createElement('div');
        indicator.className = 'drop_indicator';
        container.appendChild(indicator);
    }
}

/**
 * Removes the drop indicator from a specific column (if present).
 * @param {'to_do'|'in_progress'|'await_feedback'|'done'} columnId - Column id where the indicator should be removed.
 * @returns {void}
 */
function hideDropIndicator(columnId) {
    if (!isDragDropActive()) { return; }
    const container = document.getElementById(columnId);
    if (!container) return;
    const indicator = container.querySelector('.drop_indicator');
    if (indicator) indicator.remove();
}    
