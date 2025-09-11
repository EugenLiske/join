let nameSearchList = [];
let nameSearchListResult = [];
let assignedToList = [];

let nextSubtaskId = 0;


// EventListener -------------------------------------------------------------------

document.addEventListener('click', function(event) {
    closeDropDownAssignedToSelection(event);
    closeDropDownCategorySelection(event);
});


// Initial Function -----------------------------------------------------------------

function initAddTaskGlobal(){
    initNavigation("add_task"); // important for displaying the navigation bar 
    includeAddTaskForm();
}

async function initAddTaskOverlay(){
    await includeAddTaskForm();
}

function initAddTask(){
    
    initAssignedToList();
    getNameSearchList();
    getSearchListResult("");
    renderSearchNames();

    renderCategoryOptions();
}


// Final Add Task Buttons - Clear and Create Task ------------------------------------

function deleteForm(){
    document.getElementById("task_title_input").value = "";
    document.getElementById("task_description_input").value = "";
    document.getElementById("task_deadline_input").value = "";
    clearPriorityButtons("default");
    clearAssignedToInputArea();
    clearCategoryInput();
    renderCategoryOptions();
    clearSubtasksInputArea();

    resetWarning();
}

async function checkAndCreateTask(){ // hier kann man den Parameter für die verschiedenen Spalten als String übergeben
    let taskKey = "";
    let nextTaskId = -1;
    let newTask = null;

    if (checkRequiredFields()){
        newTask = await createTask(); // createTask ist async aufgrund der ID-Generierung
        nextTaskId = await getTaskCounter();
        taskKey = "task_" + nextTaskId;
        path = "/tasks/" + taskKey;
        await setData(newTask, path);
        await increaseTaskCounter(nextTaskId);
        deleteForm();
        window.location.href = "./board.html"
    }
    // TODO: Weiterleitung auf Board Seite
}


function checkAndEnableButton(){
    let createButtonRef = document.getElementById("create_task_button");
    if (simpleCheckRequiredFields()){
        createButtonRef.disabled = false;
    }
    else {
        createButtonRef.disabled = true;
    }
}


async function createTask(status = 0){
    const newTask = createNewTaskObject();
    newTask.id = await getTaskCounter(); // Neu zwecks ID-Speicherung im Objekt
    newTask.title = getTitle();
    newTask.description = getDescription();
    newTask.duedate = getDueDate();
    newTask.priority = currentPriority;
    newTask.category = currentCategory;
    newTask.assignedPersons = getAssignedPersons();
    newTask.subtasks = getSubtasks();
    newTask.status = status;
    newTask.kanbanBoardColumn = "to_do"; // Test für die Kanban-Spalte. Name "category" war vergeben.
    return newTask;
}

function createNewTaskObject(){
    return {
        "id": "", // Neu zwecks ID-Speicherung im Objekt
        "title": "",
        "description": "",
        "duedate": "",
        "priority": "",
        "assignedPersons": {},
        "category": "",
        "subtasks": {},
        "kanbanBoardColumn": "" // Test für die Kanban-Spalte. Name "category" war vergeben.
    };
}

function getAssignedPersons(){
    let assignedPersons = {};
    for (let personIdx = 0; personIdx < assignedToList.length; personIdx++) {
        if (assignedToList[personIdx]){
            let personKey = "contact_" + personIdx;
            
            assignedPersons[personKey] = personIdx;
        }
    }
    return assignedPersons;
}

