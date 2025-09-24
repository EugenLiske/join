let currentTask = null;

function setCurrentTask(taskId){
    currentTask = getElementWithId2(allTasks, taskId);
}


// function updateCurrentTask(task){
//     currentTask = task;
// }


function getCurrentTask(){
    return currentTask;
}

let boardContacts = null;

function getBoardContacts(){
    return boardContacts;
}

// erlaubt Fokus des Inputfelds beim Anklicken der Lupe trotz absoluter Positionierung und pointer-events:auto

function focusSearchInputField() {
    let searchInput = document.getElementById('searchInput');
    searchInput.focus();
}

// Drag & Drop Mechanismus - Deaktivierung bei unter 1460 Pixel

function isDragDropActive() {
    if (typeof window === 'undefined') {
        return true;
    } 
    if (window.innerWidth > 1460) {
        return true;
    } else {
        return false;
    }
}

function setCardsDraggableState() {
    let cards = document.getElementsByClassName('board_card');
    let draggableValue = 'false';
    if (isDragDropActive()) {
        draggableValue = 'true';
    }
    for (i = 0; i < cards.length; i++) {
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

// Drag & Drop Mechanismus

let allTasks = []; // Anpassung seitens Anne

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

function generateTodoHTML(element){ // Anpassung seitens Anne
    return `
        <div
            draggable="true"
            ondragstart="startDragging(${element['id']}, event)"
            ondragend="endDragging(event)"
            class="task"
            >
            ${element['title']} <br>
            ${element['description']}
        </div>
    `
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
}

function endDragging(event){
    if (!isDragDropActive()) { return; } 
    event.target.classList.remove('dragging');
    currentDraggedTask = null;
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

// Suchfunktionen

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

function doesTitleMatchSearchTerm(task) {
    const searchTerm = getSearchTermFromInput();

    if (searchTerm.length === 0) {
        return true;
    }

    let taskTitleLower = '';
    if (typeof task.title === 'string') {
        taskTitleLower = task.title.toLowerCase();
    }

    let taskDescriptionLower = '';
    if (typeof task.description === 'string') {
        taskDescriptionLower = task.description.toLowerCase();
    }

    const matchesTitle = taskTitleLower.includes(searchTerm);
    const matchesDescription = taskDescriptionLower.includes(searchTerm);

    return matchesTitle || matchesDescription;
}

function onSearchInput() {
    updateHTML();
    updateSearchErrorMessage();
}

function updateSearchErrorMessage() {
  const searchTerm = getSearchTermFromInput();
  const errorElement = document.getElementById('search_error');
  if (!errorElement) return;

  if (searchTerm.length < 2) {
    errorElement.style.display = 'none';
    return;
  }

  let anyMatch = false;
  for (let i = 0; i < allTasks.length; i++) {
    if (doesTitleMatchSearchTerm(allTasks[i])) {
      anyMatch = true;
      break;
    }
  }
  if (anyMatch) {
    errorElement.style.display = 'none';
    } else {
    errorElement.style.display = 'block';
  }
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


function getBoardColumnsList() {                 
    return ['to_do', 'in_progress', 'await_feedback', 'done'];  
}                                                

/* Helfer */
function hasHorizontalOverflow(el) {
    if (!el) { return false; }                         
    var cards = el.getElementsByClassName('board_card');
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

/* <= 14 Zeilen */
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
    for (var i = 0; i < cols.length; i++) {       
        updateOverflowHintFor(cols[i]);           
    }                                             
}    