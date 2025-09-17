// erlaubt Fokus des Inputfelds beim Anklicken der Lupe trotz absoluter Positionierung und pointer-events:auto

function focusSearchInputField() {
    let searchInput = document.getElementById('searchInput');
    searchInput.focus();
}

// Drag & Drop Mechanismus

let allTasks = [];

async function loadTasksFromDB(){
    let taskResponse = await getData("/tasks");
    let taskKeysArray = Object.keys(taskResponse);

    for (let index = 0; index < taskKeysArray.length; index++) {
        allTasks.push(taskResponse[taskKeysArray[index]]
            // {
                // id:                 taskResponse[taskKeysArray[index]].id,
                // title:              taskResponse[taskKeysArray[index]].title,
                // kanbanBoardColumn:  taskResponse[taskKeysArray[index]].kanbanBoardColumn
            // }
        )  
    }
    console.log(taskResponse);
    console.log(taskKeysArray);
    console.log(allTasks); 
}

let currentDraggedTask;

async function initBoardPage() {
    initNavAndHeaderPage('board');
    await loadContacts();
    await loadTasksFromDB();
    updateHTML();          
  }

function updateHTML(){
    // To Do - Tasks
    let tasksToDo = allTasks.filter(task => task['kanbanBoardColumn'] == 'to_do');

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

    // In progress - Tasks
    let tasksInProgress = allTasks.filter(task => task['kanbanBoardColumn'] == 'in_progress')

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

    // Await feedback - Tasks
    let tasksAwaitFeedback = allTasks.filter(task => task['kanbanBoardColumn'] == 'await_feedback')

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

    // Done - Tasks
    let tasksDone = allTasks.filter(task => task['kanbanBoardColumn'] == 'done')

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

function generateTodoHTML(element){
    return `
        <div
            draggable="true"
            ondragstart="startDragging(${element['id']}, event)"
            ondragend="endDragging(event)"
            class="task"
            >
            ${element['title']}
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
    event.preventDefault();
}

function startDragging(id, event){
    currentDraggedTask = id;
    event.target.classList.add('dragging');
}

function endDragging(event){
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
    const container = document.getElementById(columnId);
    if (!container) return;
    const indicator = container.querySelector('.drop_indicator');
    if (indicator) indicator.remove();
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


function deleteTaskFromArray(taskId) {
    const taskIdx = allTasks.findIndex(task => task.id === taskId);
    if (taskIdx !== -1) {
        allTasks.splice(taskIdx, 1);
    }
}

function updateTask(taskId, update) {
    const taskIdx = allTasks.findIndex(task => task.id === taskId);
    if (taskIdx !== -1) {
        allTasks[taskIdx] = { ...allTasks[taskIdx], ...update };
    }
}