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

// Drag & Drop Mechanismus

/* NEU */ function isDragDropActive() {
/* NEU */     if (typeof window === 'undefined') {
/* NEU */         return true;
/* NEU */     } 
/* NEU */     if (window.innerWidth > 1460) {
/* NEU */         return true;
/* NEU */     } else {
/* NEU */         return false;
/* NEU */     }
/* NEU */ }

/* NEU */ function setCardsDraggableState() {
/* NEU */      cards = document.getElementsByClassName('board_card');
/* NEU */      draggableValue = 'false';
/* NEU */     if (isDragDropActive()) {
/* NEU */         draggableValue = 'true';
/* NEU */     }
/* NEU */     for ( i = 0; i < cards.length; i++) {
/* NEU */         cards[i].setAttribute('draggable', draggableValue);
/* NEU */     }
/* NEU */ }

/* NEU */ function clearAllDropIndicators() {
/* NEU */      columns = ['to_do', 'in_progress', 'await_feedback', 'done'];
/* NEU */     for ( i = 0; i < columns.length; i++) {
/* NEU */          container = document.getElementById(columns[i]);
/* NEU */         if (container) {
/* NEU */              indicator = container.querySelector('.drop_indicator');
/* NEU */             if (indicator) {
/* NEU */                 indicator.remove();
/* NEU */             }
/* NEU */         }
/* NEU */     }
/* NEU */ }

/* NEU */ window.onresize = function () {
/* NEU */     setCardsDraggableState();
/* NEU */     if (!isDragDropActive()) {
/* NEU */         clearAllDropIndicators();
/* NEU */     }
/* NEU */ };

let allTasks = []; // Anpassung seitens Anne

async function loadTasksFromDB(){
    let taskResponse = await getData("/tasks");
    let taskKeysArray = Object.keys(taskResponse);

    for (let index = 0; index < taskKeysArray.length; index++) {
        allTasks.push(
            taskResponse[taskKeysArray[index]]
            // {
            //     id:                 taskResponse[taskKeysArray[index]].id,
            //     title:              taskResponse[taskKeysArray[index]].title,
            //     kanbanBoardColumn:  taskResponse[taskKeysArray[index]].kanbanBoardColumn,
            //     description:        taskResponse[taskKeysArray[index]].description,
            // }
        )  
    }
    // console.log(taskResponse);
    // console.log(taskKeysArray);
    // console.log(allTasks); 
}

let currentDraggedTask;

async function initBoardPage() {
    initNavAndHeaderPage('board');
    boardContacts = await getContacts();
    await loadTasksFromDB();
    updateHTML();
    setCardsDraggableState();       
}

function updateHTML(){
    generateTasksToDoHTML();
    generateTasksInProgressHTML();
    generateTasksAwaitFeedbackHTML();
    generateTasksDoneHTML();
    setCardsDraggableState();
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
    if (!isDragDropActive()) { return; } /* NEU */
    event.preventDefault();
}

function startDragging(id, event){
    if (!isDragDropActive()) { return; } /* NEU */
    currentDraggedTask = id;
    event.target.classList.add('dragging');
}

function endDragging(event){
    if (!isDragDropActive()) { return; } /* NEU */
    event.target.classList.remove('dragging');
    currentDraggedTask = null;
}

async function moveToDifferentCategory(kanbanBoardColumn){
    const actualIndex = allTasks.findIndex(task => task.id === currentDraggedTask);
    if (actualIndex === -1) return; // Sicherheitsgurt, falls Task gerade entfernt wurde
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
    if (!isDragDropActive()) { return; } /* NEU */
    const container = document.getElementById(columnId);
    const actualIndex = allTasks.findIndex(task => task.id === currentDraggedTask);
    if (actualIndex === -1) return; // nichts „gegriffen“ oder Task nicht gefunden

    // Nicht im Ursprungs-Container anzeigen
    const originCategory = allTasks[actualIndex]['kanbanBoardColumn'];
    if (originCategory === columnId) {
        hideDropIndicator(columnId);
        return;
    }

    // Nur einen Indikator pro Spalte
    if (!container.querySelector('.drop_indicator')) {
        const indicator = document.createElement('div');
        indicator.className = 'drop_indicator';
        container.appendChild(indicator);
    }
}

function hideDropIndicator(columnId) {
    if (!isDragDropActive()) { return; } /* NEU */
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

    // Unter 3 Zeichen: keine Filterung
    if (searchTerm.length === 0) {
        return true;
    }

    // Titel immer vorhanden (laut deiner Vorgabe)
    let taskTitleLower = '';
    if (typeof task.title === 'string') {
        taskTitleLower = task.title.toLowerCase();
    }

    // Beschreibung ist optional → falls nicht vorhanden, leeren String nutzen
    let taskDescriptionLower = '';
    if (typeof task.description === 'string') {
        taskDescriptionLower = task.description.toLowerCase();
    }

    // Treffer, wenn Titel ODER Beschreibung den Suchbegriff enthält
    const matchesTitle = taskTitleLower.includes(searchTerm);
    const matchesDescription = taskDescriptionLower.includes(searchTerm);

    return matchesTitle || matchesDescription;
}

// Wird vom oninput-Attribut am <input> aufgerufen
function onSearchInput() {
    updateHTML(); // Neu-Render, Filter passiert in den Generatoren
    updateSearchErrorMessage();
}

// ==== Suche: Fehlermeldung steuern ====

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


//save vor later --> deleteTaskById

// function deleteTaskById(id) {
//     // Lokal entfernen
//     const idx = allTasks.findIndex(t => t.id === id);
//     if (idx !== -1) allTasks.splice(idx, 1);
//     updateHTML();

//     // Falls gerade diese Task gezogen wurde → „Hand“ loslassen
//     if (currentDraggedTask === id) currentDraggedTask = null;

//     // DB entfernen (Realtime DB)
//     // await fetch(`${BASE_URL}/tasks/task_${id}.json`, { method: 'DELETE' });
// }

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