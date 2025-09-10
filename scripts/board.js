// erlaubt Fokus des Inputfelds beim Anklicken der Lupe trotz absoluter Positionierung und pointer-events:auto

function focusSearchInputField() {
    let searchInput = document.getElementById('searchInput');
    searchInput.focus();
}

// Drag & Drop Mechanismus

let currentDraggedTask;

let allTasks = [
    {
        'id': 0,
        'title': "Präsentation erstellen",
        'category': "to_do"
    },
    {
        'id': 1,
        'title': "Kühlschrank reinigen",
        'category': "in_progress"
    },
    {
        'id': 2,
        'title': "Hochzeit planen",
        'category': "await_feedback"
    },
    {
        'id': 3,
        'title': "Garten pflegen",
        'category': "done"
    }
]

function updateHTML(){
    // To Do - Tasks
    let tasksToDo = allTasks.filter(task => task['category'] == 'to_do');

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
    let tasksInProgress = allTasks.filter(task => task['category'] == 'in_progress')

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
    let tasksAwaitFeedback = allTasks.filter(task => task['category'] == 'await_feedback')

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
    let tasksDone = allTasks.filter(task => task['category'] == 'done')

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
        <div draggable="true" ondragstart="startDragging(${element['id']})" class="task">${element['title']}</div>
    `
}

function generatePlaceholderHTML(category) {
    const texts = {
        'to_do': 'No tasks to do',
        'in_progress': 'No tasks in progress',
        'await_feedback': 'No tasks await feedback',
        'done': 'No tasks done'
    };
    return `
        <div class="no_tasks_placeholder">
            ${texts[category]}
        </div>
    `;
}

function allowDrop(event) {
    event.preventDefault();
}

function startDragging(id){
    currentDraggedTask = id;
}

function moveToDifferentCategory(category){
    allTasks[currentDraggedTask]['category'] = category;
    updateHTML();
}
