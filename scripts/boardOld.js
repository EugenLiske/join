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
        allTasks.push(
            {
                id:                 taskResponse[taskKeysArray[index]].id,
                title:              taskResponse[taskKeysArray[index]].title,
                kanbanBoardColumn:  taskResponse[taskKeysArray[index]].kanbanBoardColumn
            }
        )  
    }
    console.log(taskResponse);
    console.log(taskKeysArray);
    console.log(allTasks); 
}

let currentDraggedTask;

async function initBoardPage() {
    initNavAndHeaderPage('board');
    await loadTasksFromDB();
    updateHTML();          
  }

// Statische Objekte zwecks Test

// let allTasks = [
//     {
//         'id': 0,
//         'title': "Präsentation erstellen",
//         'kanbanBoardColumn': "to_do"
//     },
//     {
//         'id': 1,
//         'title': "Kühlschrank reinigen",
//         'kanbanBoardColumn': "in_progress"
//     },
//     {
//         'id': 2,
//         'title': "Hochzeit planen",
//         'kanbanBoardColumn': "await_feedback"
//     },
//     {
//         'id': 3,
//         'title': "Garten pflegen",
//         'kanbanBoardColumn': "done"
//     }
// ]

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
            toDoColumn.innerHTML += generateTodoHTML(singleTaskToDo);
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
            inProgressColumn.innerHTML += generateTodoHTML(singleTaskInProgress);
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
            awaitFeedbackColumn.innerHTML += generateTodoHTML(singleTaskAwaitFeedback);
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
            doneColumn.innerHTML += generateTodoHTML(singleTaskDone);
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
    allTasks[currentDraggedTask]['kanbanBoardColumn'] = kanbanBoardColumn;
    updateHTML();
    console.log(allTasks);

    let newKanbanColumn = allTasks[currentDraggedTask]['kanbanBoardColumn'];
    console.log(newKanbanColumn);

    let path = `/tasks/task_${currentDraggedTask}/kanbanBoardColumn`
    console.log(path);
    
    await setData(newKanbanColumn, path);
}

function showDropIndicator(columnId) {
    const container = document.getElementById(columnId);

    // Nicht im Ursprungs-Container anzeigen
    const originCategory = allTasks[currentDraggedTask]['kanbanBoardColumn'];
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
