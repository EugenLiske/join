let currentTask = null;


function setCurrentTask(taskId){
    currentTask = getElementWithId2(allTasks, taskId);
}


function getCurrentTask(){
    return currentTask;
}


let boardContacts = null;


function getBoardContacts(){
    return boardContacts;
}


// Allows focus of the input field when clicking on the magnifying glass despite absolute positioning and pointer-events:auto

function focusSearchInputField() {
    let searchInput = document.getElementById('searchInput');
    searchInput.focus();
}


// Drag & drop mechanism - Deactivation on mobile devices

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


function isDragDropActive() {
    if (typeof window === 'undefined') {
        return true;
    }
    return !hasCoarsePointer();
}


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


window.onresize = function () {
    setCardsDraggableState();
    if (!isDragDropActive()) {
        clearAllDropIndicators();
        updateAllOverflowHints();
    }
};


// Drag & drop mechanism

let allTasks = [];


async function loadTasksFromDB(){
    let taskResponse = await getData("/tasks");
    let taskKeysArray = Object.keys(taskResponse);
    for (let index = 0; index < taskKeysArray.length; index++) {
        allTasks.push(
            taskResponse[taskKeysArray[index]]
        )  
    }
}


let currentDraggedTask;


async function initBoardPage() {
    initNavAndHeaderPage('board');
    boardContacts = await getContacts();
    await loadTasksFromDB();
    updateHTML();
    setCardsDraggableState();
    updateAllOverflowHints();
    setupOverlayOutsideClickClose();      
}


function updateHTML(){
    generateTasksToDoHTML();
    generateTasksInProgressHTML();
    generateTasksAwaitFeedbackHTML();
    generateTasksDoneHTML();
    setCardsDraggableState();
    updateAllOverflowHints();
}


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


function allowDrop(event) {
    if (!isDragDropActive()) { return; } 
    event.preventDefault();
}


function startDragging(id, event){
    if (!isDragDropActive()) { return; } 
    currentDraggedTask = id;
    event.target.classList.add('dragging');
    document.querySelectorAll('.task_column_content').forEach(el => el.classList.add('drag-target-active'));
}


function endDragging(event){
    if (!isDragDropActive()) { return; } 
    event.target.classList.remove('dragging');
    currentDraggedTask = null;
    document.querySelectorAll('.task_column_content').forEach(el => el.classList.remove('drag-target-active'));
    clearAllDropIndicators();
}


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


function hideDropIndicator(columnId) {
    if (!isDragDropActive()) { return; }
    const container = document.getElementById(columnId);
    if (!container) return;
    const indicator = container.querySelector('.drop_indicator');
    if (indicator) indicator.remove();
}    